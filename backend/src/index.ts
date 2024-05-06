import Fastify from "fastify";
import dotenv from "dotenv";
import Players from "db/players";
import Matches from "db/matches";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

dotenv.config({
  path: ["../.env.local", "../.env"],
});

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

const { PORT, HOST } = process.env;

if (!PORT) {
  throw Error("process.env.PORT is not defined");
}

if (!HOST) {
  throw Error("process.env.HOST is not defined");
}

fastify.listen({ port: +PORT, host: HOST }, (err) => {
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
