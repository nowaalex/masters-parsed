import { type QueryFunction, useQuery } from "@tanstack/react-query";
import type { Match, MatchesEntryFrontend } from "common-types";
import { Link, useSearchParams } from "react-router-dom";
import { FormEvent, useEffect, useMemo, useReducer } from "react";
import BonusForm from "./BonusForm";

const rtf = new Intl.RelativeTimeFormat(navigator.language, {
  numeric: "always",
});

const queryFn: QueryFunction<
  MatchesEntryFrontend,
  [string, string, string]
> = ({ queryKey }) =>
  fetch(`/api/player?name=${queryKey[1]}&league=${queryKey[2]}`).then((res) =>
    res.json()
  );

const initialBonusValues = {
  setBonus: 0,
  firstBonus: 0,
  secondBonus: 0,
};

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

const getMatchesWithBonuses = (
  matches: MatchesEntryFrontend["data"],
  setBonus: number,
  firstBonus: number,
  secondBonus: number
) =>
  matches.map(([date, match]) => {
    const matchWithBonuses = match.map((m) => {
      let bonus =
        (m.setsWon + Math.max(m.setsWon - m.setsLost - 1, 0)) * setBonus;

      if (m.forfeit) {
        bonus /= 2;
      }

      if (m.final) {
        bonus += m.setsWon > m.setsLost ? firstBonus : secondBonus;
      }

      return {
        ...m,
        bonus,
      };
    });

    const bonus = matchWithBonuses.reduce((acc, m) => acc + m.bonus, 0);

    return [date, { match: matchWithBonuses, bonus }] as const;
  });

const reducer = (state: typeof initialBonusValues, e: FormEvent) => {
  if (e.target instanceof HTMLInputElement) {
    const { name, value } = e.target;
    return {
      ...state,
      [name]: +value,
    };
  }
  return state;
};

const Matches = () => {
  const [searchParams] = useSearchParams();

  const [{ setBonus, firstBonus, secondBonus }, setBonusValues] = useReducer(
    reducer,
    initialBonusValues
  );

  const name = searchParams.get("name") || "";
  const league = searchParams.get("league") || "";

  const title = `${name} | ${league}`;

  useEffect(() => {
    document.title = title;
  }, [title]);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["playerMatches", name, league],
    queryFn,
  });

  const matchesWithBonusesSource = isPending || error ? undefined : data.data;

  const matchesWithBonuses = useMemo(
    () =>
      matchesWithBonusesSource &&
      getMatchesWithBonuses(
        matchesWithBonusesSource,
        setBonus,
        firstBonus,
        secondBonus
      ),
    [matchesWithBonusesSource, setBonus, firstBonus, secondBonus]
  );

  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return "An error has occurred: " + error.message;
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 m-4">
        <Link to="/" className="text-2xl">
          &larr;
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">{name}</h1>
          <h2 className="text-lg font-medium">{league}</h2>
        </div>
        <BonusForm
          className="flex gap-4"
          defaultValues={initialBonusValues}
          onChange={setBonusValues}
        />
        <div className="inline-grid grid-cols-[auto,auto] gap-x-4">
          <span>Cached</span>
          <span>
            {data.timeStamp === -1
              ? "-"
              : rtf.format(
                  Math.round((data.timeStamp - Date.now()) / 1000),
                  "seconds"
                )}
          </span>
          <span>Queue size</span>
          <span>{data.queueSize}</span>
          <span>Last error</span>
          <span>{data.error || "-"}</span>
        </div>
      </div>
      <hr className="my-4" />
      {data.timeStamp !== -1 ? (
        matchesWithBonuses!.length ? (
          <div className="grid p-4 gap-y-4 gap-x-6 grid-cols-[repeat(auto-fit,_minmax(330px,_1fr))] items-start">
            {matchesWithBonuses!.map(([date, matchStruct]) => (
              <table key={date} className="table-fixed">
                <thead className="font-semibold">
                  <tr>
                    <td className="pl-1" colSpan={3}>
                      {date}
                    </td>
                    <td className="text-right pr-1">{matchStruct.bonus}</td>
                  </tr>
                </thead>
                <tbody>
                  {matchStruct.match.map((m) => (
                    <tr key={m.time} className={getMatchRowColor(m)}>
                      <td className="w-[5ch] pl-1">{m.time}</td>
                      <td className="px-2">{m.rival}</td>
                      <td className="w-[3ch]">
                        {m.setsWon}:{m.setsLost}
                      </td>
                      <td className="w-[5ch] text-right pr-1">{m.bonus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        ) : (
          <div className="text-center">No matches found</div>
        )
      ) : (
        <div className="grid justify-items-center gap-2">
          Data is not ready yet. Try to refetch in 10 seconds.
          <button
            className="p-2 border border-amber-600 bg-amber-50 hover:bg-amber-200 active:bg-slate-300"
            onClick={() => refetch()}
          >
            Refetch
          </button>
        </div>
      )}
    </>
  );
};

export default Matches;
