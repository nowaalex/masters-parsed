import Fastify from "fastify";
import Players from "db/players";
import Matches from "db/matches";
import { kill } from "utils/browser";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { Leagues } from "common";

const { PORT } = process.env;

if (!PORT) {
  throw Error("process.env.PORT is not defined");
}

const FASTIFY_OPTIONS = {
  port: +PORT,
  host: "0.0.0.0",
} as const;

console.log({ FASTIFY_OPTIONS });

await Players.refresh();

const fastify = Fastify({
  logger: true,
}).withTypeProvider<JsonSchemaToTsProvider>();

fastify.route({
  method: "GET",
  url: "/player",
  schema: {
    querystring: {
      type: "object",
      properties: {
        name: { type: "string" },
        league: { type: "string", enum: Leagues },
      },
      required: ["name", "league"],
    },
  },
  handler: (request, reply) => {
    const { name, league } = request.query;
    reply.send(Matches.get(name, league));
  },
});

fastify.get("/players", (request, reply) => reply.send(Players.list));

fastify.listen(FASTIFY_OPTIONS, (err) => {
  if (err) {
    throw err;
  }
});

[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `exit`, `SIGTERM`].forEach((evt) =>
  process.on(evt, () => {
    kill();
    fastify.close();
    Players.destroy();
    Matches.destroy();
  })
);
