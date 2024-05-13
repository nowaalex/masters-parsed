import { Link } from "react-router-dom";
import type { Match } from "common";
import type getMatchesWithBonuses from "utils/getMatchesWithBonuses";

const getMatchRowColor = (m: Match) =>
  m.forfeit
    ? "bg-neutral-300"
    : m.setsWon > m.setsLost
    ? m.final
      ? "bg-green-500"
      : "bg-green-300"
    : m.setsWon < m.setsLost
    ? m.final
      ? "bg-red-400"
      : "bg-red-300"
    : "";

interface Props {
  date: string;
  league: string;
  match: ReturnType<typeof getMatchesWithBonuses>[number][1];
}

const MatchTable = ({ date, match, league }: Props) => (
  <table className="table-fixed whitespace-nowrap">
    <thead className="font-semibold">
      <tr>
        <td className="pl-1" colSpan={3}>
          {date}
        </td>
        <td className="text-right pr-1">{match.bonus}</td>
      </tr>
    </thead>
    <tbody>
      {match.matches.map((m) => (
        <tr key={m.time} className={getMatchRowColor(m)}>
          <td className="w-[5ch] pl-1">{m.time}</td>
          <td className="px-2">
            <Link
              className="hover:underline"
              to={{
                search: new URLSearchParams({
                  name: m.rival,
                  league,
                }).toString(),
              }}
            >
              {m.rival}
            </Link>
          </td>
          <td className="w-[3ch]">
            {m.setsWon}:{m.setsLost}
          </td>
          <td className="w-[5ch] text-right pr-1">{m.bonus}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default MatchTable;
