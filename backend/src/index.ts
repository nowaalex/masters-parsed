import Fastify from "fastify";
import dotenv from "dotenv";
import Players from "db/players";
import Matches from "db/matches";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

dotenv.config({
  path: ["../.env.local", "../.env"],
});

const { BACKEND_FASTIFY_PORT, HOST } = process.env;

if (!BACKEND_FASTIFY_PORT) {
  throw Error("process.env.BACKEND_FASTIFY_PORT is not defined");
}

if (!HOST) {
  throw Error("process.env.HOST is not defined");
}

const FASTIFY_OPTIONS = { port: +BACKEND_FASTIFY_PORT, host: HOST } as const;

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
        league: { type: "string" },
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
    fastify.close();
    Players.destroy();
    Matches.destroy();
  })
);
