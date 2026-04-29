import { d as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://ontologia.com");
const $$CodeBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CodeBlock;
  const { language = "bash", code, filename } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="overflow-hidden rounded-[var(--radius-4)]" style="background: var(--gray-12); border: 1px solid var(--gray-a6);"> ${filename && renderTemplate`<div class="flex items-center justify-between px-4 py-2" style="background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08);"> <span class="font-mono text-[11px]" style="color: var(--gray-3);"> ${filename} </span> <span class="rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider" style="background: rgba(255,255,255,0.08); color: var(--gray-5);"> ${language} </span> </div>`} <pre class="overflow-x-auto px-4 py-4" style="margin: 0; font-family: var(--code-font-family); font-size: 13px; line-height: 1.7; color: var(--gray-2);"><code>${code}</code></pre> </div>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/CodeBlock.astro", void 0);

export { $$CodeBlock as $ };
