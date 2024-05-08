import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");

  return {
    preview: {
      port: +env.FRONTEND_UI_PORT,
      strictPort: true,
      host: env.HOST,
    },
    server: {
      port: +env.FRONTEND_UI_PORT,
      strictPort: true,
      host: env.HOST,
      proxy: {
        "/api": {
          target: `http://${env.HOST}:${env.BACKEND_FASTIFY_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
