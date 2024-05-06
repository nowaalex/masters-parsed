import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");
  console.log({ env });

  return {
    preview: {
      port: +env.PORT,
      strictPort: true,
    },
    server: {
      port: +env.PORT,
      strictPort: true,
      proxy: {
        "/api": {
          target: `http://${env.HOST}:${env.PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
