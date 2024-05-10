import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Form as InnerForm } from "react-router-dom";

const Leagues = [
  "Liga A",
  "Liga B",
  "Liga C",
  "Liga kobiet A",
  "Liga kobiet B",
  "Superliga",
] as const;

const Form = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["players"],
    queryFn: () => fetch("/api/players").then((res) => res.json()),
  });

  useEffect(() => {
    document.title = "Masters parsed";
  }, []);

  if (isPending) {
    return "Loading all players...";
  }

  if (error) {
    return "An error has occurred: " + error.message;
  }

  return (
    <InnerForm
      method="get"
      className="grid gap-4 p-4 max-w-[40em] [&>label]:grid"
      action="/player"
    >
      <label>
        Player
        <select name="name" required>
          {data.map((name: string) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label>
        League
        <select name="league" required>
          {Leagues.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="w-full border border-amber-700 bg-amber-50 hover:bg-amber-200 active:bg-amber-300 p-2 col-span-full"
      >
        Submit
      </button>
    </InnerForm>
  );
};

export default Form;
