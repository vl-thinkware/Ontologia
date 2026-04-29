import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$ComingSoon } from '../chunks/ComingSoon_CXZl9KVa.mjs';
export { renderers } from '../renderers.mjs';

const $$Changelog = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ComingSoon", $$ComingSoon, { "title": "Changelog", "description": "The shipping log for Semlify \u2014 feature releases, fixes, and infra notes.", "current": "/changelog", "eyebrow": "Coming with GA", "whenLabel": "First entries land at GA \xB7 Q3 2026", "body": "Every weekly release will appear here, dated and linked back to the docs page that explains what changed and why. The format is borrowed from Linear and Vercel \u2014 short, accurate, no fluff.", "bullets": [
    "One entry per release \xB7 semver tagged",
    "Inline screenshots for visible UI changes",
    "Links to the relevant docs page",
    "RSS feed for readers, JSON for integrations"
  ] })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/changelog.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/changelog.astro";
const $$url = "/changelog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Changelog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
