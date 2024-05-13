import type { Match } from "common";
import type { Bonus } from "types";

/**
 * Match bonus is affected by:
 * 1. amount of sets player won
 * 2. amount of sets player's rival lost
 * 3. forfeit (real match did not take place, rival for some reason was absent)
 * 4. place taken by the player (only 1 and 2 are rewarded)
 */
function getMatchBonus(match: Match, bonus: Bonus) {
  const victory = match.setsWon > match.setsLost;
  const rivalSets = victory ? match.setsWon - match.setsLost - 1 : 0;

  let matchBonus = (match.setsWon + rivalSets) * bonus.set;

  if (match.forfeit) {
    matchBonus /= 2;
  }

  if (match.final) {
    matchBonus += victory ? bonus.first : bonus.second;
  }

  return matchBonus;
}

export default getMatchBonus;
