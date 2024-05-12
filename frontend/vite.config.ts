import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode, command }) => {
  switch (command) {
    case "build":
      return {};

    case "serve":
      const env = loadEnv(mode, "../", "");

      const { BACKEND_FASTIFY_PORT } = env;

      if (!BACKEND_FASTIFY_PORT) {
        throw Error("vite: BACKEND_FASTIFY_PORT must be defined");
      }

      return {
        server: {
          proxy: {
            "/api": {
              target: `http://localhost:${BACKEND_FASTIFY_PORT}`,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          },
        },
      };

    default:
      throw Error(`Wrong vite command: ${command}`);
  }
});
