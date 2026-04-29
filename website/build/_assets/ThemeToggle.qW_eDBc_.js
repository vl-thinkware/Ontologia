import{j as s}from"./jsx-runtime.TBa3i5EZ.js";import{r as c}from"./index.CVf8TyFT.js";import{c as l}from"./createLucideIcon.Dd809xjr.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=l("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=l("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=l("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]),d="semlify.theme";function y(){if(typeof window>"u")return"system";const t=window.localStorage.getItem(d);return t==="light"||t==="dark"||t==="system"?t:"system"}function i(t){if(typeof document>"u")return;const r=document.body,o=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,e=t==="system"?o?"dark":"light":t;r.setAttribute("data-appearance",e),r.classList.toggle("dark",e==="dark"),r.classList.toggle("light",e==="light")}const g=[{value:"light",label:"Light",icon:u},{value:"dark",label:"Dark",icon:h},{value:"system",label:"System",icon:m}];function v(){const[t,r]=c.useState("system");c.useEffect(()=>{const e=y();if(r(e),i(e),e!=="system")return;const n=window.matchMedia("(prefers-color-scheme: dark)"),a=()=>i("system");return n.addEventListener("change",a),()=>n.removeEventListener("change",a)},[]);function o(e){r(e),window.localStorage.setItem(d,e),i(e)}return s.jsx("div",{role:"radiogroup","aria-label":"Color theme",className:"inline-flex items-center rounded-full p-0.5",style:{background:"var(--gray-3)",border:"1px solid var(--gray-a4)"},children:g.map(e=>{const n=e.icon,a=t===e.value;return s.jsx("button",{type:"button",role:"radio","aria-checked":a,"aria-label":e.label,title:e.label,onClick:()=>o(e.value),className:"inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",style:{background:a?"var(--color-panel-solid)":"transparent",color:a?"var(--gray-12)":"var(--gray-10)",boxShadow:a?"var(--shadow-1)":"none"},children:s.jsx(n,{size:13,"aria-hidden":"true"})},e.value)})})}export{v as default};
