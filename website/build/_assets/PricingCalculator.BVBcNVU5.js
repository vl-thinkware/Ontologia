import{j as e}from"./jsx-runtime.TBa3i5EZ.js";import{r as h}from"./index.CVf8TyFT.js";import{R as v}from"./theme.XMGLVZG5.js";import{c as b}from"./createLucideIcon.Dd809xjr.js";import{C as f}from"./check.D3sEDbRu.js";import"./index.BuE6vhcG.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=b("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=b("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]),m={free:{name:"Free",monthly:0,color:"var(--gray-12)",bg:"var(--gray-3)",blurb:"Evaluation, hobby projects, learning the product.",cta:{label:"Start free",href:"https://app.ontologia.com/signup"}},team:{name:"Team",monthly:499,color:"var(--accent-12)",bg:"var(--accent-3)",blurb:"Production AI teams shipping versioned ontologies.",cta:{label:"Start Team trial",href:"https://app.ontologia.com/signup?plan=team"}},business:{name:"Business",monthly:1990,color:"var(--violet-12)",bg:"var(--violet-3)",blurb:"SSO, audit log export, 99.9% SLA, priority support.",cta:{label:"Start Business trial",href:"https://app.ontologia.com/signup?plan=business"}},enterprise:{name:"Enterprise",monthly:null,color:"var(--gray-12)",bg:"var(--amber-3)",blurb:"Self-host, dedicated cluster, custom DPA, named CSM.",cta:{label:"Talk to sales",href:"mailto:hello@ontologia.com"}}},x={free:{concepts:500,apiCalls:5e3},team:{concepts:5e3,apiCalls:5e5},business:{concepts:1e6,apiCalls:5e6},enterprise:{concepts:1/0,apiCalls:1/0}};function S(r,t){const i=["free","team","business","enterprise"],l=i.filter(a=>r<=x[a].concepts&&t<=x[a].apiCalls),o=l[0]??"enterprise";let s="",c;if(o==="free")s="You fit the Free tier ceiling on both metrics.";else{const a=i[i.indexOf(o)-1],n=x[a];r>n.concepts?(s=`Concepts (${r.toLocaleString("en-US")}) exceed the ${m[a].name} ceiling of ${n.concepts.toLocaleString("en-US")}.`,c={metric:"concepts",ceiling:n.concepts}):t>n.apiCalls?(s=`API calls (${t.toLocaleString("en-US")}/mo) exceed the ${m[a].name} ceiling of ${n.apiCalls.toLocaleString("en-US")}.`,c={metric:"apiCalls",ceiling:n.apiCalls}):s=`${m[o].name} fits both your metrics with headroom.`}return{tier:o,reason:s,fits:l,outgrowing:c}}const g=[100,200,500,1e3,2e3,5e3,1e4,5e4,2e5,1e6,5e6],u=[1e3,5e3,5e4,1e5,5e5,1e6,2e6,5e6,2e7];function p(r){if(r>=1e6){const t=r/1e6;return t%1===0?`${t}M`:`${t.toFixed(1)}M`}if(r>=1e3){const t=r/1e3;return t%1===0?`${t}k`:`${t.toFixed(1)}k`}return r.toString()}function L(){const[r,t]=h.useState(5),[i,l]=h.useState(4),o=g[r],s=u[i],c=h.useMemo(()=>S(o,s),[o,s]),a=m[c.tier];return e.jsxs(v,{accentColor:"violet",grayColor:"slate",radius:"medium",scaling:"100%",panelBackground:"solid",hasBackground:!1,children:[e.jsxs("div",{className:"overflow-hidden rounded-[var(--radius-5)]",style:{background:"var(--color-panel-solid)",border:"1px solid var(--gray-a5)",boxShadow:"var(--shadow-2)"},children:[e.jsxs("div",{className:"flex flex-col items-start gap-2 px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-6",style:{background:"var(--gray-2)",borderBottom:"1px solid var(--gray-a4)"},children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-wider",style:{color:"var(--accent-11)"},children:"Estimator"}),e.jsx("h3",{className:"mt-1 text-[18px] font-bold",style:{color:"var(--gray-12)"},children:"Find your tier in 10 seconds."})]}),e.jsx("p",{className:"text-[12.5px]",style:{color:"var(--gray-11)"},children:"Pick the closest match — the recommendation updates live."})]}),e.jsxs("div",{className:"grid grid-cols-1 gap-0 md:grid-cols-12",children:[e.jsxs("div",{className:"px-6 py-6 md:col-span-7",style:{borderRight:"1px solid var(--gray-a4)"},children:[e.jsx(y,{label:"Concepts you'll model",value:p(o),hint:"Count includes every taxonomy and scheme.",min:0,max:g.length-1,currentIdx:r,onChange:t,ticks:g.map(p)}),e.jsx("div",{className:"my-6 h-px",style:{background:"var(--gray-a3)"}}),e.jsx(y,{label:"API calls per month",value:p(s),hint:"Reads from your RAG / search / catalog pipeline.",min:0,max:u.length-1,currentIdx:i,onChange:l,ticks:u.map(p)})]}),e.jsxs("div",{className:"px-6 py-6 md:col-span-5",style:{background:"var(--gray-2)"},children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(k,{size:14,style:{color:"var(--accent-11)"},"aria-hidden":!0}),e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-wider",style:{color:"var(--accent-11)"},children:"Recommended"})]}),e.jsxs("div",{className:"mt-2 flex items-baseline gap-3",children:[e.jsx("h4",{className:"text-[28px] font-bold tracking-tight",style:{color:"var(--gray-12)"},children:a.name}),a.monthly!==null?e.jsx("p",{className:"text-[14px]",style:{color:"var(--gray-11)"},children:a.monthly===0?"Free":`$${a.monthly.toLocaleString("en-US")}/mo`}):e.jsx("p",{className:"text-[14px]",style:{color:"var(--gray-11)"},children:"Custom"})]}),e.jsx("p",{className:"mt-2 text-[13px] leading-relaxed",style:{color:"var(--gray-11)"},children:a.blurb}),e.jsx("div",{className:"mt-4 rounded-[var(--radius-3)] p-3",style:{background:a.bg,border:"1px solid var(--gray-a4)"},children:e.jsxs("p",{className:"flex items-start gap-2 text-[12.5px] leading-relaxed",style:{color:a.color},children:[e.jsx(f,{size:14,style:{marginTop:2,flexShrink:0},"aria-hidden":!0}),e.jsx("span",{children:c.reason})]})}),e.jsxs("a",{href:a.cta.href,className:"mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-3)] px-4 py-2.5 text-[13px] font-medium transition-colors",style:{background:"var(--accent-9)",color:"var(--accent-contrast)"},children:[a.cta.label,e.jsx(j,{size:13,"aria-hidden":!0})]})]})]})]}),e.jsxs("p",{className:"mt-3 text-center text-[12px]",style:{color:"var(--gray-10)"},children:["Add-ons let you top up either metric without changing tier."," ",e.jsx("a",{href:"#addons",style:{color:"var(--accent-11)",fontWeight:500},children:"See add-ons"})," ","below."]})]})}function y({label:r,value:t,hint:i,min:l,max:o,currentIdx:s,onChange:c,ticks:a}){return e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("label",{className:"text-[12px] font-semibold uppercase tracking-wider",style:{color:"var(--gray-11)"},children:r}),e.jsx("span",{className:"text-[20px] font-bold tracking-tight",style:{color:"var(--gray-12)",fontVariantNumeric:"tabular-nums"},children:t})]}),e.jsx("input",{type:"range",min:l,max:o,step:1,value:s,onChange:n=>c(parseInt(n.target.value,10)),className:"custom-range mt-3 w-full","aria-label":r,"aria-valuetext":t}),e.jsx("p",{className:"mt-1 text-[11.5px]",style:{color:"var(--gray-10)"},children:i}),e.jsx("style",{children:`
        .custom-range {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            var(--accent-9) 0%,
            var(--accent-9) ${(s-l)/(o-l)*100}%,
            var(--gray-5) ${(s-l)/(o-l)*100}%,
            var(--gray-5) 100%
          );
          outline: none;
          cursor: pointer;
        }
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--accent-9);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
          cursor: pointer;
          transition: transform 100ms ease;
        }
        .custom-range::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .custom-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--accent-9);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
          cursor: pointer;
        }
        .custom-range:focus-visible {
          outline: 2px solid var(--accent-a8);
          outline-offset: 4px;
          border-radius: 2px;
        }
      `}),e.jsx("div",{className:"mt-2 flex justify-between","aria-hidden":!0,children:a.map((n,d)=>e.jsx("span",{className:"text-[10px]",style:{color:d===s?"var(--accent-11)":"var(--gray-9)",fontWeight:d===s?600:400},children:e.jsx("span",{className:d%2===0?"":"hidden sm:inline",children:n})},d))})]})}export{L as default};
