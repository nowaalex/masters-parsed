import type { Match, MatchesEntryBackend } from "common";

function extractMatchesFromElement(el: Element, playerName: string) {
  const matches: MatchesEntryBackend["data"] = [];
  let curMatches: Match[] | null = null;

  for (const row of el.children) {
    if (row.childElementCount !== 8) {
      curMatches = [];
      matches.push([row.textContent!.trim(), curMatches]);
      continue;
    }

    if (!curMatches) {
      throw Error("Error parsing matches: wrong order");
    }

    const { children } = row;

    const scoreString = children[3].textContent!.trim().toLowerCase();
    const scoreArray = scoreString.match(/(\d+)[^\d]+(\d+)/);
    const forfeit =
      scoreString.includes("forfeit") ||
      scoreString.includes("porażka techniczna");

    const datetime = children[0].textContent!.trim().split(/\s+/);
    const player1 = children[1].textContent!.trim();
    const player2 = children[5].textContent!.trim();
    const finalRaw = children[6].textContent!.trim().toLowerCase();
    const final = finalRaw === "finał";

    let setsWon = 0,
      setsLost = 0,
      rival: string;

    switch (playerName) {
      case player1:
        rival = player2;
        if (scoreArray) {
          setsWon = +scoreArray[1];
          setsLost = +scoreArray[2];
        }
        break;
      case player2:
        rival = player1;
        if (scoreArray) {
          setsWon = +scoreArray[2];
          setsLost = +scoreArray[1];
        }
        break;
      default:
        throw Error("Error parsing matches: wrong players");
    }

    curMatches.push({
      time: datetime[1],
      rival,
      setsWon,
      setsLost,
      final,
      forfeit,
    });
  }

  return matches;
}

export default extractMatchesFromElement;
