import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");

  const { FRONTEND_UI_PORT, BACKEND_FASTIFY_PORT } = env;

  if (!BACKEND_FASTIFY_PORT) {
    throw Error("vite: BACKEND_FASTIFY_PORT must be defined");
  }

  return {
    preview: {
      port: FRONTEND_UI_PORT ? +FRONTEND_UI_PORT : undefined,
      strictPort: true,
    },
    server: {
      port: FRONTEND_UI_PORT ? +FRONTEND_UI_PORT : undefined,
      strictPort: true,
      proxy: {
        "/api": {
          target: `http://localhost:${BACKEND_FASTIFY_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
