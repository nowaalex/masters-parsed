import type { Match } from "common-types";
import type { Bonus } from "components/matches/BonusForm";

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

  let result = (match.setsWon + rivalSets) * bonus.set;

  if (match.forfeit) {
    result /= 2;
  }

  if (match.final) {
    result += victory ? bonus.first : bonus.second;
  }

  return result;
}

export default getMatchBonus;
