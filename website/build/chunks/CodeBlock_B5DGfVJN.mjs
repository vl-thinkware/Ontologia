import { d as createAstro, c as createComponent, a as renderTemplate, b as addAttribute, m as maybeRenderHead } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://semlify.com");
const $$CodeBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CodeBlock;
  const { language = "bash", code, filename } = Astro2.props;
  const id = `code-${crypto.randomUUID().slice(0, 8)}`;
  return renderTemplate(_a || (_a = __template(["", '<div class="relative overflow-hidden rounded-[var(--radius-4)]" style="background: var(--gray-12); border: 1px solid var(--gray-a6);"', " data-astro-cid-jgrc2lfe> ", ' <pre class="overflow-x-auto px-4 py-4" style="margin: 0; font-family: var(--code-font-family); font-size: 13px; line-height: 1.7; color: var(--gray-2);" data-astro-cid-jgrc2lfe><code data-code-content data-astro-cid-jgrc2lfe>', "</code></pre>  ", ` </div>  <script>
  (function () {
    if (window.__copyButtonsWired) return;
    window.__copyButtonsWired = true;
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-copy-target]");
      if (!btn) return;
      const id = btn.getAttribute("data-copy-target");
      const block = document.querySelector('[data-codeblock="' + id + '"]');
      if (!block) return;
      const code = block.querySelector("[data-code-content]");
      if (!code) return;
      const text = code.textContent || "";
      const finish = function () {
        btn.classList.add("is-copied");
        const copyIcon = btn.querySelector(".copy-icon");
        const checkIcon = btn.querySelector(".check-icon");
        const label = btn.querySelector(".copy-label");
        if (copyIcon) copyIcon.classList.add("hidden");
        if (checkIcon) checkIcon.classList.remove("hidden");
        if (label) label.textContent = "Copied";
        setTimeout(function () {
          btn.classList.remove("is-copied");
          if (copyIcon) copyIcon.classList.remove("hidden");
          if (checkIcon) checkIcon.classList.add("hidden");
          if (label) label.textContent = "Copy";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(finish).catch(function () {
          /* ignore */
        });
      } else {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          finish();
        } catch (e) {
          /* ignore */
        }
        document.body.removeChild(ta);
      }
    });
  })();
<\/script>`])), maybeRenderHead(), addAttribute(id, "data-codeblock"), (filename || language) && renderTemplate`<div class="flex items-center justify-between gap-2 px-4 py-2" style="background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08);" data-astro-cid-jgrc2lfe> ${filename ? renderTemplate`<span class="truncate font-mono text-[11px]" style="color: var(--gray-3);" data-astro-cid-jgrc2lfe> ${filename} </span>` : renderTemplate`<span data-astro-cid-jgrc2lfe></span>`} <div class="flex items-center gap-2" data-astro-cid-jgrc2lfe> <span class="rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider" style="background: rgba(255,255,255,0.08); color: var(--gray-5);" data-astro-cid-jgrc2lfe> ${language} </span> <button type="button" class="copy-btn flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors" style="background: rgba(255,255,255,0.06); color: var(--gray-3); font-size: 11px; line-height: 1.4;"${addAttribute(id, "data-copy-target")} aria-label="Copy code to clipboard" title="Copy" data-astro-cid-jgrc2lfe> <svg class="copy-icon h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-jgrc2lfe> <rect width="14" height="14" x="8" y="8" rx="2" ry="2" data-astro-cid-jgrc2lfe></rect> <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" data-astro-cid-jgrc2lfe></path> </svg> <svg class="check-icon hidden h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-jgrc2lfe> <path d="M20 6 9 17l-5-5" data-astro-cid-jgrc2lfe></path> </svg> <span class="copy-label" data-astro-cid-jgrc2lfe>Copy</span> </button> </div> </div>`, code, !filename && !language && renderTemplate`<button type="button" class="copy-btn-floating absolute right-3 top-3 flex items-center gap-1 rounded-md px-2 py-1 font-medium transition-opacity" style="background: rgba(255,255,255,0.06); color: var(--gray-3); font-size: 11px; opacity: 0; backdrop-filter: blur(4px);"${addAttribute(id, "data-copy-target")} aria-label="Copy code to clipboard" data-astro-cid-jgrc2lfe> <svg class="copy-icon h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-jgrc2lfe> <rect width="14" height="14" x="8" y="8" rx="2" ry="2" data-astro-cid-jgrc2lfe></rect> <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" data-astro-cid-jgrc2lfe></path> </svg> <span class="copy-label" data-astro-cid-jgrc2lfe>Copy</span> </button>`);
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/CodeBlock.astro", void 0);

export { $$CodeBlock as $ };
