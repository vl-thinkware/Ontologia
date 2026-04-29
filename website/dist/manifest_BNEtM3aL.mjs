import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, g as decodeKey } from './chunks/astro/server_irxFjrx1.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/","adapterName":"","routes":[{"file":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/legal/privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/legal/privacy","isIndex":false,"type":"page","pattern":"^\\/legal\\/privacy\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/privacy.astro","pathname":"/legal/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/legal/terms/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/legal/terms","isIndex":false,"type":"page","pattern":"^\\/legal\\/terms\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/terms.astro","pathname":"/legal/terms","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/pricing/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/pricing","isIndex":false,"type":"page","pattern":"^\\/pricing\\/?$","segments":[[{"content":"pricing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pricing.astro","pathname":"/pricing","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/product/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/product","isIndex":true,"type":"page","pattern":"^\\/product\\/?$","segments":[[{"content":"product","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/product/index.astro","pathname":"/product","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/security/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/security","isIndex":false,"type":"page","pattern":"^\\/security\\/?$","segments":[[{"content":"security","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/security.astro","pathname":"/security","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://ontologia.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/legal/privacy.astro",{"propagation":"none","containsHead":true}],["/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/legal/terms.astro",{"propagation":"none","containsHead":true}],["/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/pricing.astro",{"propagation":"none","containsHead":true}],["/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/product/index.astro",{"propagation":"none","containsHead":true}],["/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/security.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/legal/privacy@_@astro":"pages/legal/privacy.astro.mjs","\u0000@astro-page:src/pages/legal/terms@_@astro":"pages/legal/terms.astro.mjs","\u0000@astro-page:src/pages/pricing@_@astro":"pages/pricing.astro.mjs","\u0000@astro-page:src/pages/product/index@_@astro":"pages/product.astro.mjs","\u0000@astro-page:src/pages/security@_@astro":"pages/security.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_BNEtM3aL.mjs","/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/PricingTable.tsx":"_assets/PricingTable.B4HzmNsi.js","@astrojs/react/client.js":"_assets/client.qqhsWAPA.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/404.html","/file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/legal/privacy/index.html","/file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/legal/terms/index.html","/file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/pricing/index.html","/file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/product/index.html","/file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/security/index.html","/file:///sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/dist/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"TOaRREOrIkfkUOIfgUuwUNtf78XWGEXtqWVv7Yjeo4Y=","experimentalEnvGetSecretEnabled":false});

export { manifest };
