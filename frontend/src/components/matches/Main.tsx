import { type QueryFunction, useQuery } from "@tanstack/react-query";
import type { Match, MatchesEntryFrontend } from "common-types";
import { Link, useSearchParams } from "react-router-dom";
import { FormEvent, useEffect, useMemo, useReducer } from "react";
import BonusForm, { type Bonus } from "./BonusForm";
import SystemInfo from "./SystemInfo";

const queryFn: QueryFunction<
  MatchesEntryFrontend,
  [string, string, string]
> = ({ queryKey }) =>
  fetch(`/api/player?name=${queryKey[1]}&league=${queryKey[2]}`).then((res) =>
    res.json()
  );

const initialBonusValues = {
  set: 0,
  first: 0,
  second: 0,
} as const satisfies Bonus;

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

const getMatchBonus = (match: Match, bonus: Bonus) => {
  let result =
    (match.setsWon + Math.max(match.setsWon - match.setsLost - 1, 0)) *
    bonus.set;

  if (match.forfeit) {
    result /= 2;
  }

  if (match.final) {
    result += match.setsWon > match.setsLost ? bonus.first : bonus.second;
  }

  return result;
};

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
        match: matchWithBonuses,
        bonus: matchWithBonuses.reduce((acc, m) => acc + m.bonus, 0),
      },
    ] as const;
  });

const reducer = (state: Bonus, e: FormEvent) => {
  if (e.target instanceof HTMLInputElement) {
    const { name, value } = e.target;
    const numericValue = Number.parseInt(value, 10);
    if (Number.isFinite(numericValue)) {
      return {
        ...state,
        [name]: numericValue,
      };
    }
  }
  return state;
};

const Matches = () => {
  const [searchParams] = useSearchParams();

  const [bonus, setBonusValues] = useReducer(reducer, initialBonusValues);

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
      getMatchesWithBonuses(matchesWithBonusesSource, bonus),
    [matchesWithBonusesSource, bonus]
  );

  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return "An error has occurred: " + error.message;
  }

  return (
    <>
      <div className="flex flex-wrap justify-evenly gap-x-12 gap-y-6 m-4">
        <div className="flex flex-auto items-center gap-4 w-full md:w-auto justify-center">
          <Link to="/" className="text-2xl">
            &larr;
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <h2 className="text-lg font-medium">{league}</h2>
          </div>
        </div>
        <BonusForm
          key={league}
          className="flex flex-auto justify-center gap-4"
          onChange={setBonusValues}
        />
        <SystemInfo
          timeStamp={data.timeStamp}
          error={data.error}
          queueSize={data.queueSize}
          className="flex-auto text-center"
        />
      </div>
      <hr className="my-4" />
      {data.timeStamp === -1 ? (
        <div className="grid justify-items-center gap-2">
          Data is not ready yet. Try to refetch in 10 seconds.
          <button
            className="p-2 border border-amber-600 bg-amber-50 hover:bg-amber-200 active:bg-slate-300"
            onClick={() => refetch()}
          >
            Refetch
          </button>
        </div>
      ) : matchesWithBonuses?.length ? (
        <div className="grid p-4 gap-y-4 gap-x-6 grid-cols-[repeat(auto-fit,_minmax(330px,_1fr))] items-start">
          {matchesWithBonuses.map(([date, matchStruct]) => (
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
          ))}
        </div>
      ) : (
        <div className="text-center">No matches found</div>
      )}
    </>
  );
};

export default Matches;
