import { type QueryFunction, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Form as InnerForm } from "react-router-dom";
import { Leagues } from "common";

const queryFn: QueryFunction<string[], [string]> = () =>
  fetch("/api/players")
    .then((res) => res.json())
    .then((res) => res.sort((a: string, b: string) => a.localeCompare(b)));

const Form = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["players"],
    queryFn,
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
      className="grid gap-4 p-4 h-screen place-content-center"
      action="/player"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">
        Masters parser
      </h1>
      <label className="grid">
        Player
        <select name="name" required>
          {data.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid">
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
