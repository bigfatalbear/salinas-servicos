var e=`Salinas Serviços`,t=`A cidade se conecta aqui.`,n=`Encontre profissionais, serviços e negócios em Salinas da Margarida, na Baía de Todos-os-Santos. Contato direto pelo WhatsApp.`,r=`Salinas da Margarida - BA`,i=`Salinas da Margarida`,a=`Baía de Todos-os-Santos · Bahia`,o=`https://bigfatalbear.github.io/salinas-servicos`,s=`🚀 NOVIDADE EM SALINAS DA MARGARIDA E REGIÃO! 🌴📲

🔎 SALINAS SERVIÇOS chegou para conectar você a serviços, profissionais, empresas e negócios da nossa região.

💼 Você tem um negócio ou presta algum serviço?
📢 Divulgue seu trabalho e seja encontrado por novos clientes!

🛠️ Está procurando um serviço?
🔍 Encontre profissionais e empresas de forma simples e rápida.

📍 Salinas da Margarida e regiões
🤝 Valorize quem trabalha e empreende por aqui!

🌐 ACESSE AGORA:
👉 ${o}/

📲 Conheça, cadastre seu negócio e compartilhe com seus amigos!

💙 SALINAS SERVIÇOS
Conectando pessoas, serviços e negócios da nossa região.`,c=`https://www.salinasdamargarida.ba.gov.br/site/dadosmunicipais`,l=`Olá! Encontrei seu perfil no Salinas Serviços e gostaria de saber mais.`,u=`ss:favorites`,d=`ss:voter-token`,f=`ss:poll-voted`,p=`ss:theme`,m=`ss:install-dismissed`,h=[{key:`yes`,label:`Sim, quero avaliações`},{key:`no`,label:`Não preciso`},{key:`maybe`,label:`Talvez`}];function g(...e){return e.filter(Boolean).join(` `)}function _(e){if(!e)return``;if(/^(https?:|data:|blob:)/i.test(e))return e;let t=`/salinas-servicos/`;return e.startsWith(t)?e:`${t}${e.replace(/^\/+/,``)}`}function v(e){return e.toLocaleString(`pt-BR`)}function y(e){return e.trim().split(/\s+/).slice(0,2).map(e=>e[0]?.toUpperCase()??``).join(``)}function b(e){return e.replace(/\D/g,``)}function x(e){let t=b(e);return t.length===13?`+${t.slice(0,2)} (${t.slice(2,4)}) ${t.slice(4,9)}-${t.slice(9)}`:t.length===12?`+${t.slice(0,2)} (${t.slice(2,4)}) ${t.slice(4,8)}-${t.slice(8)}`:t.length===11?`(${t.slice(0,2)}) ${t.slice(2,7)}-${t.slice(7)}`:t.length===10?`(${t.slice(0,2)}) ${t.slice(2,6)}-${t.slice(6)}`:e}function S(e,t){let n=b(e);return n.startsWith(`55`)||(n=`55${n}`),`https://wa.me/${n}?text=${encodeURIComponent(t)}`}function C(e,t=150){return e.length<=t?e:`${e.slice(0,t-1).trimEnd()}…`}function w(e){return e.normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}function T(){let e=localStorage.getItem(d);if(e)return e;let t=crypto.randomUUID();return localStorage.setItem(d,t),t}function E(){try{let e=localStorage.getItem(u);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>typeof e==`string`):[]}catch{return[]}}function D(e){localStorage.setItem(u,JSON.stringify(e)),window.dispatchEvent(new Event(`ss:favorites-changed`))}function O(){try{let e=localStorage.getItem(`ss:recommended`);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>typeof e==`string`):[]}catch{return[]}}function k(e){localStorage.setItem(`ss:recommended`,JSON.stringify(e))}export{f as C,p as D,o as E,l as O,h as S,s as T,t as _,_ as a,m as b,E as c,C as d,S as f,e as g,n as h,T as i,O as l,k as m,v as n,y as o,D as p,x as r,b as s,g as t,w as u,r as v,a as w,c as x,i as y};