import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_PATH?.trim() || "/";

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(rootDir, "src"),
        "@content": resolve(rootDir, "content"),
      },
    },
  };
});
