import type { MatchesEntryFrontend } from "common";
import type { Bonus } from "types";
import getMatchBonus from "./getMatchBonus";

const getMatchesWithBonuses = (
  matches: MatchesEntryFrontend["data"],
  bonus: Bonus
) =>
  matches.map(([date, match]) => {
    const matchWithBonuses = match.map((m) => ({
      ...m,
      bonus: getMatchBonus(m, bonus),
    }));

    return [
      date,
      {
        matches: matchWithBonuses,
        bonus: matchWithBonuses.reduce((acc, m) => acc + m.bonus, 0),
      },
    ] as const;
  });

export default getMatchesWithBonuses;
