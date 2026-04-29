import { c as createComponent, m as maybeRenderHead, a as renderTemplate, r as renderComponent, b as addAttribute } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$ProductPageNav } from '../../chunks/ProductPageNav_CFwaH2pY.mjs';
import { $ as $$ProductFeatureBlock } from '../../chunks/ProductFeatureBlock_DS6uqNcp.mjs';
import 'clsx';
import { $ as $$CodeBlock } from '../../chunks/CodeBlock_B5DGfVJN.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$RbacIllustration = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative mx-auto w-full max-w-[480px]" role="img" aria-label="Role-based access control permissions matrix showing four roles and their allowed actions."> <svg viewBox="0 0 480 420" xmlns="http://www.w3.org/2000/svg" class="h-auto w-full" role="img"> <title>RBAC permissions matrix</title> <desc>A four-by-five grid mapping the Owner, Admin, Editor, and Viewer roles
      against five common ontology actions.</desc> <defs> <linearGradient id="rbacCard" x1="0" y1="0" x2="1" y2="1"> <stop offset="0" stop-color="var(--color-panel-solid)"></stop> <stop offset="1" stop-color="var(--gray-2)"></stop> </linearGradient> <filter id="rbacShadow" x="-10%" y="-10%" width="120%" height="120%"> <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgb(15 23 42)" flood-opacity="0.07"></feDropShadow> </filter> </defs> <pattern id="rbacDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"> <circle cx="1" cy="1" r="1" fill="var(--gray-a4)"></circle> </pattern> <rect width="480" height="420" fill="url(#rbacDots)" opacity="0.4"></rect> <g filter="url(#rbacShadow)"> <rect x="20" y="30" width="440" height="360" rx="12" fill="url(#rbacCard)" stroke="var(--gray-a5)"></rect> <!-- Header --> <text x="40" y="60" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="var(--gray-11)" letter-spacing="0.12em">MEMBERS · ROLES</text> <text x="40" y="80" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="var(--gray-12)">Workspace permissions</text> <!-- Column header chips --> <g font-family="Inter, sans-serif" font-size="9" font-weight="600"> <g transform="translate(190,100)"> <rect width="42" height="20" rx="10" fill="var(--gray-3)" stroke="var(--gray-a5)"></rect> <text x="21" y="13" text-anchor="middle" fill="var(--gray-11)">View</text> </g> <g transform="translate(238,100)"> <rect width="42" height="20" rx="10" fill="var(--gray-3)" stroke="var(--gray-a5)"></rect> <text x="21" y="13" text-anchor="middle" fill="var(--gray-11)">Edit</text> </g> <g transform="translate(286,100)"> <rect width="42" height="20" rx="10" fill="var(--gray-3)" stroke="var(--gray-a5)"></rect> <text x="21" y="13" text-anchor="middle" fill="var(--gray-11)">Tag</text> </g> <g transform="translate(334,100)"> <rect width="42" height="20" rx="10" fill="var(--gray-3)" stroke="var(--gray-a5)"></rect> <text x="21" y="13" text-anchor="middle" fill="var(--gray-11)">Invite</text> </g> <g transform="translate(382,100)"> <rect width="50" height="20" rx="10" fill="var(--gray-3)" stroke="var(--gray-a5)"></rect> <text x="25" y="13" text-anchor="middle" fill="var(--gray-11)">Delete</text> </g> </g> <!-- Rows: Owner, Admin, Editor, Viewer -->  <line x1="178" y1="135" x2="178" y2="365" stroke="var(--gray-a4)" stroke-width="1" stroke-dasharray="2,3"></line> <!-- Helper macro repeated by hand: role label + 5 cells --> <!-- Row 1: Owner — all green --> <g transform="translate(0,140)"> <text x="40" y="20" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--gray-12)">Owner</text> <text x="40" y="36" font-family="Inter, sans-serif" font-size="10" fill="var(--gray-10)">Founders</text>  <circle cx="211" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 207 22 L 210 25 L 215 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="259" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 255 22 L 258 25 L 263 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="307" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 303 22 L 306 25 L 311 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="355" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 351 22 L 354 25 L 359 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="407" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 403 22 L 406 25 L 411 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> </g> <!-- Row 2: Admin — all green except none --> <g transform="translate(0,200)"> <text x="40" y="20" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--gray-12)">Admin</text> <text x="40" y="36" font-family="Inter, sans-serif" font-size="10" fill="var(--gray-10)">Trusted maintainers</text> <circle cx="211" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 207 22 L 210 25 L 215 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="259" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 255 22 L 258 25 L 263 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="307" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 303 22 L 306 25 L 311 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="355" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 351 22 L 354 25 L 359 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="407" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 403 18 L 411 26 M 411 18 L 403 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> </g> <!-- Row 3: Editor --> <g transform="translate(0,260)"> <text x="40" y="20" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--gray-12)">Editor</text> <text x="40" y="36" font-family="Inter, sans-serif" font-size="10" fill="var(--gray-10)">Curators · taxonomists</text> <circle cx="211" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 207 22 L 210 25 L 215 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="259" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 255 22 L 258 25 L 263 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="307" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 303 18 L 311 26 M 311 18 L 303 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> <circle cx="355" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 351 18 L 359 26 M 359 18 L 351 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> <circle cx="407" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 403 18 L 411 26 M 411 18 L 403 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> </g> <!-- Row 4: Viewer --> <g transform="translate(0,320)"> <text x="40" y="20" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="var(--gray-12)">Viewer</text> <text x="40" y="36" font-family="Inter, sans-serif" font-size="10" fill="var(--gray-10)">Read-only · auditors</text> <circle cx="211" cy="22" r="9" fill="var(--green-3)" stroke="var(--green-9)"></circle> <path d="M 207 22 L 210 25 L 215 19" stroke="var(--green-11)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="259" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 255 18 L 263 26 M 263 18 L 255 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> <circle cx="307" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 303 18 L 311 26 M 311 18 L 303 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> <circle cx="355" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 351 18 L 359 26 M 359 18 L 351 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> <circle cx="407" cy="22" r="9" fill="var(--gray-3)" stroke="var(--gray-a6)"></circle> <path d="M 403 18 L 411 26 M 411 18 L 403 26" stroke="var(--gray-9)" stroke-width="1.4" stroke-linecap="round"></path> </g> </g> </svg> </div>`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/illustrations/RbacIllustration.astro", void 0);

const $$Rbac = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      { "@type": "ListItem", position: 2, name: "Product", item: "https://semlify.com/product" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Roles & permissions",
        item: "https://semlify.com/product/rbac"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Roles & permissions \u2014 Semlify", "description": "Built-in roles on every tier, custom roles on Business, per-resource permissions, SSO with group mapping, and scoped API tokens. The full RBAC posture for AI and governance teams.", "current": "/product/rbac", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductPageNav", $$ProductPageNav, { "current": "/product/rbac" })}  ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12"> <div class="md:col-span-6" data-fade-up> <p class="text-eyebrow">Product · Roles &amp; permissions</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);">
The right people, the right access.
</h1> <p class="mt-5 max-w-xl text-lg leading-relaxed" style="color: var(--gray-11);">
Four built-in roles ship on every tier. Define your own custom
          roles on Business. Scope permissions to a workspace, an ontology,
          or a single scheme. Map your IdP groups straight to Semlify
          roles via SAML. Decide who can read, edit, tag, invite — and audit
          all of it from one screen.
</p> <div class="mt-7 flex flex-wrap gap-3"> <a href="/access" class="btn-primary">Try free</a> <a href="/product" class="btn-secondary">All product features</a> </div> </div> <div class="md:col-span-6" data-fade-up data-delay="1"> ${renderComponent($$result2, "RbacIllustration", $$RbacIllustration, {})} </div> </div> </section>  <section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">Why it matters</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
A taxonomy is a shared artefact. Access shouldn't be a free-for-all.
</h2> <p class="mt-5 text-[16px] leading-relaxed" style="color: var(--gray-11);">
The same workspace hosts the AI engineer who indexes against the
        graph, the taxonomist who curates it, the governance lead who
        approves changes, and the auditor who reads but never edits. Without
        roles, every action is a free-for-all — and every "who changed
        this?" question becomes an investigation.
</p> <p class="mt-4 text-[16px] leading-relaxed" style="color: var(--gray-11);">
Roles aren't the audit log; the audit log says <em>what happened</em>.
        Roles say <em>what's allowed to happen</em>. Together they're the
        smallest possible governance posture that survives a procurement
        review.
</p> </div> </section>  ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Level 1 \xB7 Every tier", "title": "Four built-in roles cover most teams.", "body": "Owner, Admin, Editor, Viewer. The four roles each correspond to a real lifecycle position \u2014 founder, trusted maintainer, day-to-day curator, read-only consumer. They ship on every tier from Free upward, with no setup. Most workspaces never need anything else.", "bullets": [
    "Owner \u2014 full control, including billing and member removal",
    "Admin \u2014 everything except billing; can invite and tag releases",
    "Editor \u2014 read and write concepts, schemes, relations; cannot tag or invite",
    "Viewer \u2014 read-only access for auditors and downstream consumers"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "RbacIllustration", $$RbacIllustration, {})} ` })}  ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Level 2 \xB7 Business tier", "title": "Custom roles for the 5% who need them.", "body": "When the four built-ins don't fit, design your own. A role is a name plus a set of granted permissions across the seven action categories: read, write, tag, deprecate, export, invite, billing. Build a 'Tagger' role that can read and tag but not edit. Build a 'Junior curator' that can write to drafts but not publish. Roles live at the workspace level and apply to every member granted them.", "reverse": true, "bullets": [
    "Granular permissions across seven action categories",
    "Compose roles from primitives \u2014 no hidden inheritance gotchas",
    "Built-in roles remain available alongside custom ones",
    "Edit a role and every member with it inherits the change instantly"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "json", "filename": "Custom role \xB7 Junior Curator", "code": `{
  "id":         "role_junior_curator",
  "name":       "Junior Curator",
  "tier":       "custom",
  "permissions": {
    "concept.read":       true,
    "concept.write":      true,
    "concept.deprecate":  false,
    "scheme.read":        true,
    "scheme.write":       false,
    "tag.create":         false,
    "export.run":         true,
    "member.invite":      false,
    "billing.view":       false
  },
  "createdBy":  "valentin@example.com",
  "createdAt":  "2026-04-12T11:08:33Z"
}` })} ` })}  ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Level 3 \xB7 Business tier", "title": "Permissions scope to the resource.", "body": "A role isn't always 'everywhere in the workspace.' Mixed-sensitivity workspaces \u2014 say, a public Cars ontology alongside a regulated Compliance ontology \u2014 need finer scoping. Grant a user Editor on `ont_cars` and Viewer on `ont_compliance`. The same person, the same workspace, two different postures, automatically enforced.", "bullets": [
    "Scope each role grant to: workspace \xB7 ontology \xB7 scheme",
    "A user can hold different roles in different ontologies of the same workspace",
    "Per-scheme grants for shared ontologies with mixed sensitivity",
    "Validation panel and exports respect the active grant \u2014 no leakage"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "json", "filename": "Role grants for one user", "code": `[
  {
    "userEmail":   "claire@example.com",
    "role":        "editor",
    "scope":       { "kind": "ontology", "ontologyId": "ont_cars" }
  },
  {
    "userEmail":   "claire@example.com",
    "role":        "viewer",
    "scope":       { "kind": "ontology", "ontologyId": "ont_compliance" }
  },
  {
    "userEmail":   "claire@example.com",
    "role":        "role_junior_curator",
    "scope":       { "kind": "scheme",
                     "ontologyId": "ont_cars",
                     "schemeId":  "cs_body_styles" }
  }
]` })} ` })}  ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Level 4 \xB7 Business tier", "title": "SAML SSO with IdP-group \u2192 role mapping.", "body": "Your identity provider already knows who's a Senior Curator and who's a New Hire. Don't rebuild that knowledge in Semlify \u2014 map it. Connect Okta, Entra, JumpCloud, or any SAML 2.0 IdP. Map a group claim like `engineering-data` to the Editor role, or to a custom role you've defined. Just-in-time provisioning means new hires land in the right role on first sign-in, no manual invite step.", "reverse": true, "bullets": [
    "SAML 2.0 \u2014 works with Okta, Entra ID, JumpCloud, Google Workspace",
    "Map SAML group attributes to Semlify roles, declaratively",
    "Just-in-time provisioning \xB7 first sign-in lands in the mapped role",
    "Group changes in your IdP propagate on the next sign-in"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "yaml", "filename": "SSO group mapping", "code": `# Maps the IdP "groups" SAML claim to Semlify roles.
# First match wins. Users without a match cannot sign in.

mappings:
  - claim:    "groups"
    contains: "semlify-owners"
    role:     "owner"

  - claim:    "groups"
    contains: "data-platform-admins"
    role:     "admin"

  - claim:    "groups"
    contains: "engineering-data"
    role:     "editor"

  - claim:    "groups"
    contains: "compliance-readonly"
    role:     "viewer"
    scope:    { kind: "ontology", ontologyId: "ont_compliance" }

  - claim:    "groups"
    contains: "junior-curators"
    role:     "role_junior_curator"` })} ` })}  ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Every tier", "title": "API tokens carry their own role.", "body": "Generate an API token from any workspace; it inherits a role at creation time. Most pipelines only need to read, so the default is the most restrictive role that works. A leaked Viewer token can't write, can't delete, can't see other workspaces. Revoke from the dashboard at any time; the change propagates within seconds. Every token also has a last-used timestamp and IP \u2014 spot a leaked token before the auditor does.", "bullets": [
    "Pick the role at creation \xB7 same primitives as user roles, including custom",
    "One token = one workspace = one scope = one role",
    "Last-used timestamp and IP exposed in the dashboard",
    "Revoke is immediate \xB7 removed members lose every token they issued"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "bash", "filename": "Reading with a Viewer token", "code": `# A Viewer token can read but not write
curl https://api.semlify.com/v1/ontologies/cars/concepts \\
  -H "Authorization: Bearer ont_pat_viewer_abc123"

# Same token cannot write
curl -X POST https://api.semlify.com/v1/ontologies/cars/concepts \\
  -H "Authorization: Bearer ont_pat_viewer_abc123"
# 403 Forbidden  \xB7  role 'viewer' lacks 'concept.write'

# Token scoped to a single ontology cannot reach another
curl https://api.semlify.com/v1/ontologies/compliance/concepts \\
  -H "Authorization: Bearer ont_pat_viewer_abc123"
# 403 Forbidden  \xB7  token scope does not include 'ont_compliance'` })} ` })}  <section class="py-16 md:py-20" style="background: var(--gray-2);"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">Audit &amp; visibility</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Every grant is a record. Every record is queryable.
</h2> <p class="mt-3 text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
Role grants live in the same change history as concepts and tags.
        The Members view is a sortable list of every active grant; the audit
        log is the full history of who granted what to whom, when, and why.
</p> <ul class="mt-8 space-y-3" role="list"> ${[
    "Members view \u2014 sortable by role, scope, last-seen, granted-by",
    "One-click revoke; one-click change-role; one-click extend access",
    "Every grant emits a ChangeEvent \u2014 visible in the global audit log",
    "Audit log API on Business+ \u2014 pipe role events into your own SIEM",
    "Quarterly access review export \u2014 auditors download a CSV in seconds"
  ].map((line) => renderTemplate`<li class="flex items-start gap-2.5 rounded-[var(--radius-3)] p-3" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4);" data-fade-up> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-top: 3px; flex-shrink: 0;"> <path d="M20 6 9 17l-5-5"></path> </svg> <span class="text-[14px]" style="color: var(--gray-12);"> ${line} </span> </li>`)} </ul> </div> </section>  <section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-4xl"> <p class="text-eyebrow">By tier</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);">
What unlocks where.
</h2> <div class="mt-8 overflow-hidden rounded-[var(--radius-4)]" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4);"> <table class="w-full text-[13.5px]"> <thead> <tr style="border-bottom: 1px solid var(--gray-a4); background: var(--gray-2);"> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11);">
Capability
</th> <th class="px-4 py-3 text-center font-semibold" style="color: var(--gray-11);">Free</th> <th class="px-4 py-3 text-center font-semibold" style="color: var(--gray-11);">Team</th> <th class="px-4 py-3 text-center font-semibold" style="color: var(--gray-11);">Business</th> <th class="px-4 py-3 text-center font-semibold" style="color: var(--gray-11);">Enterprise</th> </tr> </thead> <tbody> ${[
    ["Four built-in roles", true, true, true, true],
    ["Scoped API tokens", true, true, true, true],
    ["Workspace-scoped permissions", true, true, true, true],
    ["Members view + audit history", true, true, true, true],
    ["Custom roles", false, false, true, true],
    ["Per-ontology / per-scheme grants", false, false, true, true],
    ["SAML SSO with group mapping", false, false, true, true],
    ["Audit log export over API", false, false, true, true],
    ["Custom role-attribute policies (ABAC)", false, false, false, true],
    ["Identity-provider SCIM provisioning", false, false, false, true]
  ].map((row, i) => renderTemplate`<tr${addAttribute(`${i !== 0 ? "border-top: 1px solid var(--gray-a3);" : ""}`, "style")}> <td class="px-4 py-3 font-medium" style="color: var(--gray-12);"> ${row[0]} </td> ${[row[1], row[2], row[3], row[4]].map((v) => renderTemplate`<td class="px-4 py-3 text-center"> ${v ? renderTemplate`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" aria-label="Included" style="display: inline-block; vertical-align: middle;"> <path d="M20 6 9 17l-5-5"></path> </svg>` : renderTemplate`<span style="color: var(--gray-9);">—</span>`} </td>`)} </tr>`)} </tbody> </table> </div> </div> </section>  <section class="py-12 md:py-16" style="background: var(--gray-2);"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">Further out</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);">
On the radar, not on a date.
</h2> <ul class="mt-6 space-y-2.5" role="list"> ${[
    "Just-in-time access \u2014 request a role grant for the next four hours, with auto-expiry",
    "Audit-only role with cryptographic read receipts for regulated environments",
    "Approval workflows on grants \u2014 second pair of eyes before a role is created",
    "Attribute-based access control \u2014 predicates over concept properties (e.g. 'department=R&D')"
  ].map((line) => renderTemplate`<li class="flex items-start gap-2.5 text-[14.5px]" style="color: var(--gray-12);"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--violet-11)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-top: 4px; flex-shrink: 0;"> <circle cx="12" cy="12" r="10"></circle> <path d="M12 8v4l3 2"></path> </svg> <span>${line}</span> </li>`)} </ul> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Stop debating who can edit what.", "subtitle": "Built-in roles on every tier. Custom roles, per-resource grants, and SAML on Business. Free workspace, no credit card." })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/rbac.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/rbac.astro";
const $$url = "/product/rbac";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Rbac,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
