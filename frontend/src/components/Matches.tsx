import { useQuery } from "@tanstack/react-query";
import BonusForm from "./BonusForm";
import { useSearchParams } from "react-router-dom";

const rtf = new Intl.RelativeTimeFormat(navigator.language, {
  numeric: "always",
});

const Matches = () => {
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name");
  const league = searchParams.get("league");

  const { isPending, error, data } = useQuery({
    queryKey: ["playerMatches", name, league],
    queryFn: () =>
      fetch(`/api/player?name=${name}&league=${league}`).then((res) =>
        res.json()
      ),
  });

  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return "An error has occurred: " + error.message;
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 m-4">
        <div>
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <h2 className="text-lg font-medium">{data.league}</h2>
        </div>
        <BonusForm className="flex gap-4" />

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
      <hr />
      {data.timeStamp !== -1 ? (
        <div className="grid p-4 gap-y-4 gap-x-6 grid-cols-[repeat(auto-fit,_minmax(330px,_1fr))]">
          {data.data.map(([date, match]: any) => (
            <table key={date} className="match-table">
              <thead className="font-semibold">
                <tr>
                  <td colSpan={3}>{date}</td>
                </tr>
              </thead>
              <tbody>
                {match.map((m: any) => (
                  <tr key={m.time}>
                    <td>{m.time}</td>
                    <td>{m.rival}</td>
                    <td>
                      {m.setsWon}:{m.setsLost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid justify-items-center gap-2">
          Data is not ready yet. Try to refresh this page in 10 seconds.
          <button
            className="p-2 border border-amber-600 bg-amber-50 hover:bg-amber-200 active:bg-slate-300"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      )}
    </>
  );
};

export default Matches;
