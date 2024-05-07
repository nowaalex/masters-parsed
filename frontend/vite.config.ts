import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");

  return {
    preview: {
      port: +env.FRONTEND_DEV_PORT,
      strictPort: true,
    },
    server: {
      port: +env.FRONTEND_DEV_PORT,
      strictPort: true,
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
