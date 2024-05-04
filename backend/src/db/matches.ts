import getPlayerMatches from "utils/getPlayerMatches";
import Players from "db/players";
import type { MatchesEntryBackend, MatchesEntryFrontend } from "common-types";

const REFETCH_INTERVAL = 1000 * 60 * 2;

class Matches {
  /**
   * player matches by compound key (name_league)
   */
  #map = new Map<string, MatchesEntryBackend>();

  /**
   * Quantity of pending entries
   */
  #queueSize = 0;

  async refetchEntryIfNeeded(entry: MatchesEntryBackend) {
    if (entry.isPending) {
      return;
    }

    const playerLink = Players.getLink(entry.name);

    if (!playerLink) {
      return;
    }

    const ts = Date.now();

    if (ts - entry.timeStamp < REFETCH_INTERVAL) {
      return;
    }

    for (let i = 0; i < 3; i++) {
      try {
        this.#queueSize++;
        entry.isPending = true;
        const matches = await getPlayerMatches(
          playerLink,
          entry.name,
          entry.league
        );
        entry.timeStamp = ts;
        entry.data = matches;
        entry.error = "";
        return;
      } catch (e) {
        entry.error = "" + e;
        console.log(e);
      } finally {
        entry.isPending = false;
        --this.#queueSize;
      }
    }
  }

  get(name: string, league: string): MatchesEntryFrontend {
    const key = `${name}_${league}`;
    let entry = this.#map.get(key);

    if (!entry) {
      entry = {
        name,
        league,
        timeStamp: -1,
        isPending: false,
        data: null,
        error: "",
      };
      this.#map.set(key, entry);
    }

    this.refetchEntryIfNeeded(entry);

    return {
      queueSize: this.#queueSize,
      name: entry.name,
      league: entry.league,
      timeStamp: entry.timeStamp,
      data: entry.data,
      error: entry.error,
    };
  }

  destroy() {
    this.#map.clear();
  }
}

export default new Matches();
