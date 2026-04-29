import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$UseCasePageNav, a as $$UseCaseHero } from '../../chunks/UseCaseHero_CkUIn6k0.mjs';
import { $ as $$ProductFeatureBlock } from '../../chunks/ProductFeatureBlock_DS6uqNcp.mjs';
import { $ as $$SchemaCanvasIllustration } from '../../chunks/SchemaCanvasIllustration_p2M0w-dw.mjs';
import { $ as $$ApiPlaygroundIllustration } from '../../chunks/ApiPlaygroundIllustration_BVCoAUtE.mjs';
import { $ as $$CodeBlock } from '../../chunks/CodeBlock_B5DGfVJN.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$Rag = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      { "@type": "ListItem", position: 2, name: "Use cases", item: "https://semlify.com/use-cases/rag" },
      {
        "@type": "ListItem",
        position: 3,
        name: "RAG",
        item: "https://semlify.com/use-cases/rag"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "RAG ontology \u2014 Ground your AI in a versioned graph \xB7 Semlify", "description": "Pin your RAG retrieval index to a tagged ontology snapshot, negotiate language, and re-index on tag.created webhooks. Stop watching your AI drift when a concept moves.", "current": "/use-cases/rag", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "UseCasePageNav", $$UseCasePageNav, { "current": "/use-cases/rag" })} ${renderComponent($$result2, "UseCaseHero", $$UseCaseHero, { "eyebrow": "Use case \xB7 Retrieval-augmented generation", "title": "Ground your RAG in a versioned ontology.", "subtitle": "The same concept, the same labels, the same definitions \u2014 every time your model retrieves. Tag a known-good state. Re-index when you choose. Stop watching your AI drift." })}  ${maybeRenderHead()}<section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">The problem</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Your model is grounded in a moving target.
</h2> <p class="mt-5 text-[16px] leading-relaxed" style="color: var(--gray-11);">
Most RAG pipelines pull domain knowledge from a wiki, a Notion page, or
        a flat-file glossary. The content moves around. Definitions get
        rewritten without notice. A maintainer renames a concept on Tuesday and
        every retrieval after lunch returns subtly wrong context. You discover
        it on Friday when a customer support call goes sideways.
</p> <p class="mt-4 text-[16px] leading-relaxed" style="color: var(--gray-11);">
The AI didn't hallucinate. The data did. And there's no log, no
        revert, no way to point at the change that broke things — because the
        upstream system was never built to track them.
</p> </div> </section>  ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "The shape", "title": "A typed graph your pipeline can pin to.", "body": "Semlify gives every concept a stable id, a SKOS-aligned label set, and a typed relation map. Your retriever indexes the JSON-LD or SKOS Turtle export. When you're ready to ship a change, you tag it. Until then, your pipeline pins to the last-known-good tag.", "bullets": [
    "Stable concept ids that survive label changes",
    "Multilingual labels \u2014 your retriever can pick a locale per query",
    "Typed relations let you walk neighbours during retrieval",
    "Every change is reversible \u2014 a botched edit can be undone in one click"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "SchemaCanvasIllustration", $$SchemaCanvasIllustration, {})} ` })}  <section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-4xl"> <p class="text-eyebrow">Wire it in</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
From the editor to your retriever.
</h2> <p class="mt-4 text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
Three calls — fetch the concepts, index them, subscribe to tag webhooks
        for incremental re-indexing.
</p> <div class="mt-6"> ${renderComponent($$result2, "CodeBlock", $$CodeBlock, { "language": "python", "filename": "indexer.py", "code": `import requests, os

ONT = "https://api.semlify.com/v1/ontologies/your_ontology"
TOKEN = os.environ["ONTOLOGIA_TOKEN"]
TAG = os.environ.get("ONTOLOGIA_TAG", "latest")

# 1. Pull the latest tagged snapshot as JSON-LD
resp = requests.get(
    f"{ONT}/concepts",
    params={"tag": TAG, "lang": "en", "format": "jsonld"},
    headers={"Authorization": f"Bearer {TOKEN}"},
)
graph = resp.json()["@graph"]

# 2. Index each concept \u2014 id is stable across label changes
for c in graph:
    embed_and_upsert(
        id=c["@id"],
        text=" ".join([
            c["skos:prefLabel"][0]["@value"],
            *[a["@value"] for a in c.get("skos:altLabel", [])],
            c.get("skos:definition", [{}])[0].get("@value", ""),
        ]),
        meta={"tag": TAG, "scheme": c["skos:inScheme"]},
    )

# 3. Subscribe to tag webhooks for incremental re-indexing
# POST /v1/webhooks {url, events: ["tag.created"]}` })} </div> </div> </section>  <section class="py-16 md:py-20" style="background: var(--gray-2);"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">Your first week</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
From signup to grounded retrieval in seven days.
</h2> <ol class="mt-8 space-y-6" style="counter-reset: step;"> ${[
    {
      h: "Day 1 \xB7 Pick a starter and add the first 30 concepts",
      p: "The Catalog template seeds you with a usable T-Box and a scheme. Replace the example concepts with your own using the CSV import wizard or the New Concept modal."
    },
    {
      h: "Day 2 \xB7 Tag v0.1 and wire the indexer",
      p: "Tag the current state. Point your retrieval pipeline at the JSON-LD export. Run a quality check on retrieval against ten known queries."
    },
    {
      h: "Day 3\u20134 \xB7 Curate, fix, re-tag",
      p: "Use the Validation panel to catch orphans, duplicates, and domain violations. Accept the AI-suggested altLabels for the queries that under-recalled. Re-tag as v0.2."
    },
    {
      h: "Day 5 \xB7 Subscribe to tag webhooks",
      p: "Ship the webhook listener so the indexer re-runs whenever a maintainer publishes a new tag. Production pipelines pin to a known tag, dev pipelines follow latest."
    },
    {
      h: "Day 6\u20137 \xB7 Multilingual or multi-scheme",
      p: "Add a second language with the auto-translate AI helper. Or split your ontology into two schemes (e.g. products vs. categories) and index them as separate Faiss / Pinecone namespaces."
    }
  ].map((step, i) => renderTemplate`<li class="flex gap-4" data-fade-up${addAttribute(String(Math.min(i, 3)), "data-delay")}> <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold" style="background: var(--accent-9); color: var(--accent-contrast);"> ${i + 1} </span> <div> <h3 class="text-[15px] font-bold" style="color: var(--gray-12);"> ${step.h} </h3> <p class="mt-1 text-[14px] leading-relaxed" style="color: var(--gray-11);"> ${step.p} </p> </div> </li>`)} </ol> </div> </section> ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Stable on the wire", "title": "Your retriever sees the API, not the editor.", "body": "The Schema, Taxonomies, and AI work happens in the editor. Your retrieval pipeline only sees the API. Pin to a tag. Negotiate language. Pick JSON-LD or SKOS Turtle. The shape doesn't change between releases \u2014 only the data inside it does.", "reverse": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ApiPlaygroundIllustration", $$ApiPlaygroundIllustration, {})} ` })} ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Stop debugging upstream drift.", "subtitle": "Free workspace. Catalog starter pre-loaded. Wire your retriever in an afternoon." })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/use-cases/rag.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/use-cases/rag.astro";
const $$url = "/use-cases/rag";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Rag,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
