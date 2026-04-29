import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$ProductPageNav } from '../../chunks/ProductPageNav_CFwaH2pY.mjs';
import { $ as $$ProductFeatureBlock } from '../../chunks/ProductFeatureBlock_DS6uqNcp.mjs';
import { $ as $$GovernanceIllustration, a as $$ValidationIllustration } from '../../chunks/ValidationIllustration_B9c2Fbxe.mjs';
import { $ as $$CodeBlock } from '../../chunks/CodeBlock_B5DGfVJN.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$Governance = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      { "@type": "ListItem", position: 2, name: "Product", item: "https://semlify.com/product" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Governance",
        item: "https://semlify.com/product/governance"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Governance & change history \u2014 Semlify", "description": "Every ontology change is a reversible, attributable event. Tag snapshots, diff tags, revert mistakes, and catch validation violations before they ship.", "current": "/product/governance", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductPageNav", $$ProductPageNav, { "current": "/product/governance" })} ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12"> <div class="md:col-span-6" data-fade-up> <p class="text-eyebrow">Product · Governance</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);">
Trust your taxonomy again.
</h1> <p class="mt-5 max-w-xl text-lg leading-relaxed" style="color: var(--gray-11);">
Every change records who, what, when, and why. Revert any one. Tag
          known-good states. Compare tags side by side. Catch broken references
          before they reach the API. This is what was missing from the
          spreadsheet.
</p> <div class="mt-7 flex flex-wrap gap-3"> <a href="/access" class="btn-primary">Try free</a> <a href="/security" class="btn-secondary">See security posture</a> </div> </div> <div class="md:col-span-6" data-fade-up data-delay="1"> ${renderComponent($$result2, "GovernanceIllustration", $$GovernanceIllustration, {})} </div> </div> </section> ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Change events", "title": "Every change is a record.", "body": "Create, update, delete, revert, tag, bulk_import \u2014 six event kinds, one timeline. Every event captures author, timestamp, entity, and an optional message. The timeline is the audit log; the audit log is the timeline.", "bullets": [
    "Filterable by event kind, entity, author, scheme",
    "Click any event to see the field-level diff",
    "Author avatar with initials and color from the workspace",
    "Available via the API for export to your own audit pipeline"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "json", "filename": "ChangeEvent", "code": `{
  "id":         "ce_2389",
  "kind":       "update",
  "entityKind": "concept",
  "entityId":   "c_camry",
  "entityName": "Toyota Camry",
  "summary":    "Edited prefLabel \xB7 en",
  "message":    "Match the 2026 marketing copy",
  "author":     { "name": "Valentin", "initials": "VL" },
  "at":         "2026-04-25T14:32:08Z"
}` })} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Tags", "title": "Pin a state. Diff two states.", "body": "Tagging names a ChangeEvent (`v1.3`, `2026-Q2`). Downstream consumers pin API calls to the tag for stability. Tags can't be moved \u2014 to supersede a tag, append a new one. The tag-to-tag diff shows added, modified, and removed concepts as a single rollup.", "reverse": true, "bullets": [
    "Unique tag names per ontology",
    "Tag list visible in History panel and Export modal",
    "Tag-to-tag diff with added / modified / removed counts",
    "Tags emit `tag.created` webhooks for downstream pipelines"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "GovernanceIllustration", $$GovernanceIllustration, {})} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Revert", "title": "Undo, without losing history.", "body": "Revert appends a new event that inverts a prior one. The original event stays visible in history. A revert can itself be reverted. For ranges (`revert everything since v1.2`) we generate one event per affected entity and run it as an async job.", "bullets": [
    "Single-event revert from the diff modal",
    "Multi-event revert with progress UI for large ranges",
    "Reverts are linked back to the original event for traceability",
    "Plain old append-only history \u2014 nothing is ever deleted"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "bash", "filename": "Revert via API", "code": `# Single event
curl -X POST "https://api.semlify.com/v1/change-events/ce_087/revert" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{ "message": "wrong domain on poweredBy" }'

# Range revert (since tag v1.2)
curl -X POST ".../tags/v1.2/revert-since" -H "..."` })} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Validation panel", "title": "Catch issues before they ship.", "body": "A live panel that runs every check on every edit. Orphan concepts, domain / range violations, duplicate prefLabels per scheme, deprecated-but-still-referenced. Click any issue to jump to the offender. Filter by severity. Resolve in place.", "reverse": true, "bullets": [
    "Five built-in rules covering the most common drift patterns",
    "Errors block exports; warnings don't",
    "Runs on every save in under a second for ontologies up to 5,000 concepts",
    "Validation results exposed via the API so downstream pipelines can react"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ValidationIllustration", $$ValidationIllustration, {})} ` })} ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Stop being afraid to change a concept.", "subtitle": "Every change is reversible. Every state is reachable. Free workspace, no credit card." })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/governance.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/governance.astro";
const $$url = "/product/governance";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Governance,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
