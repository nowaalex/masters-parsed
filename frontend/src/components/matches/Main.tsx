import { Link, useSearchParams } from "react-router-dom";
import { type FormEvent, useEffect, useMemo, useReducer } from "react";
import { type QueryFunction, useQuery } from "@tanstack/react-query";
import { type MatchesEntryFrontend } from "common";
import type { Bonus } from "types";
import BonusForm from "./BonusForm";
import SystemInfo from "./SystemInfo";
import MatchTable from "./MatchTable";
import getMatchesWithBonuses from "../../utils/getMatchesWithBonuses";

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

const bonusValuesReducer = (state: Bonus, e: FormEvent) => {
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
  const [bonus, setBonusValues] = useReducer(
    bonusValuesReducer,
    initialBonusValues
  );

  const [searchParams] = useSearchParams();

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
        <div className="grid p-4 gap-y-4 gap-x-6 grid-cols-[repeat(auto-fit,_minmax(340px,_1fr))] items-start">
          {matchesWithBonuses.map(([date, matchStruct]) => (
            <MatchTable
              key={date}
              date={date}
              league={league}
              match={matchStruct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">No matches found</div>
      )}
    </>
  );
};

export default Matches;
