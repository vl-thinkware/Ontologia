import{j as i}from"./jsx-runtime.TBa3i5EZ.js";import{r as s}from"./index.CVf8TyFT.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),d=(...t)=>t.filter((r,a,e)=>!!r&&r.trim()!==""&&e.indexOf(r)===a).join(" ").trim();/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var p={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=s.forwardRef(({color:t="currentColor",size:r=24,strokeWidth:a=2,absoluteStrokeWidth:e,className:n="",children:o,iconNode:m,...h},y)=>s.createElement("svg",{ref:y,...p,width:r,height:r,stroke:t,strokeWidth:e?Number(a)*24/Number(r):a,className:d("lucide",n),...h},[...m.map(([g,f])=>s.createElement(g,f)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=(t,r)=>{const a=s.forwardRef(({className:e,...n},o)=>s.createElement(w,{ref:o,iconNode:r,className:d(`lucide-${k(t)}`,e),...n}));return a.displayName=`${t}`,a};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=c("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=c("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=c("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]),u="ontologia.theme";function M(){if(typeof window>"u")return"system";const t=window.localStorage.getItem(u);return t==="light"||t==="dark"||t==="system"?t:"system"}function l(t){if(typeof document>"u")return;const r=document.body,a=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,e=t==="system"?a?"dark":"light":t;r.setAttribute("data-appearance",e),r.classList.toggle("dark",e==="dark"),r.classList.toggle("light",e==="light")}const j=[{value:"light",label:"Light",icon:x},{value:"dark",label:"Dark",icon:b},{value:"system",label:"System",icon:v}];function L(){const[t,r]=s.useState("system");s.useEffect(()=>{const e=M();if(r(e),l(e),e!=="system")return;const n=window.matchMedia("(prefers-color-scheme: dark)"),o=()=>l("system");return n.addEventListener("change",o),()=>n.removeEventListener("change",o)},[]);function a(e){r(e),window.localStorage.setItem(u,e),l(e)}return i.jsx("div",{role:"radiogroup","aria-label":"Color theme",className:"inline-flex items-center rounded-full p-0.5",style:{background:"var(--gray-3)",border:"1px solid var(--gray-a4)"},children:j.map(e=>{const n=e.icon,o=t===e.value;return i.jsx("button",{type:"button",role:"radio","aria-checked":o,"aria-label":e.label,title:e.label,onClick:()=>a(e.value),className:"inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",style:{background:o?"var(--color-panel-solid)":"transparent",color:o?"var(--gray-12)":"var(--gray-10)",boxShadow:o?"var(--shadow-1)":"none"},children:i.jsx(n,{size:13,"aria-hidden":"true"})},e.value)})})}export{L as default};
