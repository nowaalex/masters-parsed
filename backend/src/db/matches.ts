import getPlayerMatches from "utils/getPlayerMatches";
import Players from "db/players";

const REFETCH_INTERVAL = 1000 * 60 * 2;

interface MatchesEntry {
  isPending: boolean;
  name: string;
  league: string;
  timeStamp: number;
  data: Awaited<ReturnType<typeof getPlayerMatches>>;
  error: string;
}

class Matches {
  /**
   * player matches by compound key (name_league)
   */
  #map = new Map<string, MatchesEntry>();

  /**
   * Quantity of pending entries
   */
  #queueSize = 0;

  async refetchEntryIfNeeded(entry: MatchesEntry) {
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
      } finally {
        entry.isPending = false;
        --this.#queueSize;
      }
    }
  }

  get(name: string, league: string) {
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
    } as const;
  }

  destroy() {
    this.#map.clear();
  }
}

export default new Matches();
