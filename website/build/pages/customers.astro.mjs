import { d as createAstro, c as createComponent } from '../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://semlify.com");
const $$Customers = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Customers;
  return Astro2.redirect("/", 301);
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/customers.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/customers.astro";
const $$url = "/customers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Customers,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
