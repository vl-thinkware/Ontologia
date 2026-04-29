// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://semlify.com",
  output: "static",
  integrations: [
    react(),
    tailwind({
      // We use Radix Themes tokens for visuals; Tailwind is layout-only.
      // Don't inject Tailwind's preflight base styles — Radix Themes
      // ships its own reset.
      applyBaseStyles: false,
    }),
    sitemap({
      // Keep redirect-only routes and confirmation / error pages out of
      // search-engine indexes. The list is intentionally explicit — easier
      // to audit than a regex.
      filter: (page) => {
        const excluded = [
          "https://semlify.com/customers/",
          "https://semlify.com/customers",
          "https://semlify.com/use-cases/",
          "https://semlify.com/use-cases",
          "https://semlify.com/access/thanks/",
          "https://semlify.com/access/thanks",
          "https://semlify.com/404/",
          "https://semlify.com/404",
        ];
        return !excluded.includes(page);
      },
    }),
  ],
  build: {
    assets: "_assets",
  },
  // Build into `build/` rather than the default `dist/`. Reason: cloud-sync
  // can lock files inside a previously-built `dist/`, and Astro's clean step
  // then fails with EPERM. Netlify's `publish` is set to `build` in
  // netlify.toml, so deploys keep working.
  outDir: "./build",
  vite: {
    ssr: {
      // @radix-ui/themes ships ESM that needs to be inlined during SSR build.
      noExternal: ["@radix-ui/themes"],
    },
    // Move Vite's dep cache out of the cloud-synced mount so re-optimization
    // doesn't fail on locked files. (Netlify uses /tmp implicitly.)
    cacheDir: "/tmp/semlify-website-vite-cache",
  },
});
