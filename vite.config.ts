import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

function resolveBasePath() {
  const explicitBase = process.env.VITE_BASE_PATH;
  if (explicitBase) {
    return explicitBase.endsWith("/") ? explicitBase : `${explicitBase}/`;
  }

  const repository = process.env.GITHUB_REPOSITORY;
  if (process.env.GITHUB_ACTIONS && repository) {
    const repoName = repository.split("/")[1] ?? "";
    return repoName ? `/${repoName}/` : "/";
  }

  return "/";
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
  base: resolveBasePath(),
});
