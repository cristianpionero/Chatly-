// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: { host: "0.0.0.0", port: 3000, allowedHosts: true },
    plugins: [
      {
        name: "silence-use-client-warnings",
        enforce: "pre",
        onLog(_level: string, log: { code?: string; message?: string }) {
          if (
            log.code === "MODULE_LEVEL_DIRECTIVE" ||
            log.code === "INEFFECTIVE_DYNAMIC_IMPORT" ||
            log.message?.includes("use client") ||
            log.message?.includes("MODULE_LEVEL_DIRECTIVE")
          ) {
            return false;
          }
        },
      },
    ],
    build: {
      rolldownOptions: {
        onLog(
          _level: string,
          log: { code?: string; message?: string },
          defaultHandler?: (_lvl: string, _l: unknown) => void,
        ) {
          if (
            log.code === "MODULE_LEVEL_DIRECTIVE" ||
            log.code === "INEFFECTIVE_DYNAMIC_IMPORT" ||
            log.message?.includes("use client")
          ) {
            return;
          }
          defaultHandler?.(_level, log);
        },
        onwarn(warning: { code?: string; message?: string }, warn: (_w: unknown) => void) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            warning.code === "INEFFECTIVE_DYNAMIC_IMPORT" ||
            warning.message?.includes("use client")
          ) {
            return;
          }
          warn(warning);
        },
      },
      rollupOptions: {
        onLog(
          _level: string,
          log: { code?: string; message?: string },
          defaultHandler?: (_lvl: string, _l: unknown) => void,
        ) {
          if (
            log.code === "MODULE_LEVEL_DIRECTIVE" ||
            log.code === "INEFFECTIVE_DYNAMIC_IMPORT" ||
            log.message?.includes("use client")
          ) {
            return;
          }
          defaultHandler?.(_level, log);
        },
        onwarn(warning: { code?: string; message?: string }, warn: (_w: unknown) => void) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            warning.code === "INEFFECTIVE_DYNAMIC_IMPORT" ||
            warning.message?.includes("use client")
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
