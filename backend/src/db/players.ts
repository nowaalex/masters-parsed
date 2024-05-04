import getAllPlayerEntries from "utils/getAllPlayerEntries";

const CACHE_AGE_MS = 1000 * 60 * 60;

class Players {
  /**
   * List of player full names
   */
  list: string[] = [];

  /**
   * Player link by full name
   */
  #map = new Map<string, string>();

  #timer = setInterval(() => this.refresh(), CACHE_AGE_MS);

  async refresh() {
    for (let j = 0; j < 5; j++) {
      try {
        const playerEntries = await getAllPlayerEntries();
        this.#map = new Map(playerEntries);
        // filtering duplicates
        this.list = Array.from(this.#map.keys());
        return;
      } catch (e) {
        console.log(e);
      }
    }
  }

  getLink(name: string) {
    return this.#map.get(name);
  }

  destroy() {
    clearInterval(this.#timer);
    this.list = [];
    this.#map.clear();
  }
}

export default new Players();
