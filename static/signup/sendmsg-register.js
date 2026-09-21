(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function o(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=o(r);fetch(r.href,i)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis,G=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),oe=new WeakMap;let ye=class{constructor(e,o,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o;const o=this.t;if(G&&e===void 0){const s=o!==void 0&&o.length===1;s&&(e=oe.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&oe.set(o,e))}return e}toString(){return this.cssText}};const Pe=t=>new ye(typeof t=="string"?t:t+"",void 0,W),Le=(t,...e)=>{const o=t.length===1?t[0]:e.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1],t[0]);return new ye(o,t,W)},Ie=(t,e)=>{if(G)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of e){const s=document.createElement("style"),r=R.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=o.cssText,t.appendChild(s)}},se=G?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(const s of e.cssRules)o+=s.cssText;return Pe(o)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Me,defineProperty:Te,getOwnPropertyDescriptor:He,getOwnPropertyNames:Oe,getOwnPropertySymbols:Ue,getPrototypeOf:Ne}=Object,V=globalThis,re=V.trustedTypes,Re=re?re.emptyScript:"",Be=V.reactiveElementPolyfillSupport,P=(t,e)=>t,z={toAttribute(t,e){switch(e){case Boolean:t=t?Re:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},J=(t,e)=>!Me(t,e),ie={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:J};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=ie){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,o);r!==void 0&&Te(this.prototype,e,r)}}static getPropertyDescriptor(e,o,s){const{get:r,set:i}=He(this.prototype,e)??{get(){return this[o]},set(n){this[o]=n}};return{get:r,set(n){const l=r?.call(this);i?.call(this,n),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ie}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;const e=Ne(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){const o=this.properties,s=[...Oe(o),...Ue(o)];for(const r of s)this.createProperty(r,o[r])}const e=this[Symbol.metadata];if(e!==null){const o=litPropertyMetadata.get(e);if(o!==void 0)for(const[s,r]of o)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[o,s]of this.elementProperties){const r=this._$Eu(o,s);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const o=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)o.unshift(se(r))}else e!==void 0&&o.push(se(e));return o}static _$Eu(e,o){const s=o.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,o=this.constructor.elementProperties;for(const s of o.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ie(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,s){this._$AK(e,s)}_$ET(e,o){const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const i=(s.converter?.toAttribute!==void 0?s.converter:z).toAttribute(o,s.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,o){const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const i=s.getPropertyOptions(r),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:z;this._$Em=r;const l=n.fromAttribute(o,i.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(e,o,s,r=!1,i){if(e!==void 0){const n=this.constructor;if(r===!1&&(i=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??J)(i,o)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,o,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??o??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(o=void 0),this._$AL.set(e,o)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,i]of s){const{wrapped:n}=i,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,i,l)}}let e=!1;const o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(o)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[P("elementProperties")]=new Map,A[P("finalized")]=new Map,Be?.({ReactiveElement:A}),(V.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const X=globalThis,ne=t=>t,D=X.trustedTypes,ae=D?D.createPolicy("lit-html",{createHTML:t=>t}):void 0,we="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+w,ze=`<${xe}>`,k=document,I=()=>k.createComment(""),M=t=>t===null||typeof t!="object"&&typeof t!="function",Q=Array.isArray,De=t=>Q(t)||typeof t?.[Symbol.iterator]=="function",Z=`[ 	
\f\r]`,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,le=/-->/g,de=/>/g,x=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ce=/'/g,he=/"/g,$e=/^(?:script|style|textarea|title)$/i,Ve=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),c=Ve(1),_=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),pe=new WeakMap,$=k.createTreeWalker(k,129);function ke(t,e){if(!Q(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ae!==void 0?ae.createHTML(e):e}const je=(t,e)=>{const o=t.length-1,s=[];let r,i=e===2?"<svg>":e===3?"<math>":"",n=S;for(let l=0;l<o;l++){const a=t[l];let u,m,p=-1,b=0;for(;b<a.length&&(n.lastIndex=b,m=n.exec(a),m!==null);)b=n.lastIndex,n===S?m[1]==="!--"?n=le:m[1]!==void 0?n=de:m[2]!==void 0?($e.test(m[2])&&(r=RegExp("</"+m[2],"g")),n=x):m[3]!==void 0&&(n=x):n===x?m[0]===">"?(n=r??S,p=-1):m[1]===void 0?p=-2:(p=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?x:m[3]==='"'?he:ce):n===he||n===ce?n=x:n===le||n===de?n=S:(n=x,r=void 0);const y=n===x&&t[l+1].startsWith("/>")?" ":"";i+=n===S?a+ze:p>=0?(s.push(u),a.slice(0,p)+we+a.slice(p)+w+y):a+w+(p===-2?l:y)}return[ke(t,i+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class T{constructor({strings:e,_$litType$:o},s){let r;this.parts=[];let i=0,n=0;const l=e.length-1,a=this.parts,[u,m]=je(e,o);if(this.el=T.createElement(u,s),$.currentNode=this.el.content,o===2||o===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=$.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const p of r.getAttributeNames())if(p.endsWith(we)){const b=m[n++],y=r.getAttribute(p).split(w),O=/([.?@])?(.*)/.exec(b);a.push({type:1,index:i,name:O[2],strings:y,ctor:O[1]==="."?Fe:O[1]==="?"?Ye:O[1]==="@"?Ke:j}),r.removeAttribute(p)}else p.startsWith(w)&&(a.push({type:6,index:i}),r.removeAttribute(p));if($e.test(r.tagName)){const p=r.textContent.split(w),b=p.length-1;if(b>0){r.textContent=D?D.emptyScript:"";for(let y=0;y<b;y++)r.append(p[y],I()),$.nextNode(),a.push({type:2,index:++i});r.append(p[b],I())}}}else if(r.nodeType===8)if(r.data===xe)a.push({type:2,index:i});else{let p=-1;for(;(p=r.data.indexOf(w,p+1))!==-1;)a.push({type:7,index:i}),p+=w.length-1}i++}}static createElement(e,o){const s=k.createElement("template");return s.innerHTML=e,s}}function C(t,e,o=t,s){if(e===_)return e;let r=s!==void 0?o._$Co?.[s]:o._$Cl;const i=M(e)?void 0:e._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(t),r._$AT(t,o,s)),s!==void 0?(o._$Co??=[])[s]=r:o._$Cl=r),r!==void 0&&(e=C(t,r._$AS(t,e.values),r,s)),e}class Ze{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:o},parts:s}=this._$AD,r=(e?.creationScope??k).importNode(o,!0);$.currentNode=r;let i=$.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new H(i,i.nextSibling,this,e):a.type===1?u=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(u=new qe(i,this,e)),this._$AV.push(u),a=s[++l]}n!==a?.index&&(i=$.nextNode(),n++)}return $.currentNode=k,r}p(e){let o=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,o),o+=s.strings.length-2):s._$AI(e[o])),o++}}class H{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,s,r){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=C(this,e,o),M(e)?e===g||e==null||e===""?(this._$AH!==g&&this._$AR(),this._$AH=g):e!==this._$AH&&e!==_&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):De(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==g&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){const{values:o,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=T.createElement(ke(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(o);else{const i=new Ze(r,this),n=i.u(this.options);i.p(o),this.T(n),this._$AH=i}}_$AC(e){let o=pe.get(e.strings);return o===void 0&&pe.set(e.strings,o=new T(e)),o}k(e){Q(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let s,r=0;for(const i of e)r===o.length?o.push(s=new H(this.O(I()),this.O(I()),this,this.options)):s=o[r],s._$AI(i),r++;r<o.length&&(this._$AR(s&&s._$AB.nextSibling,r),o.length=r)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){const s=ne(e).nextSibling;ne(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class j{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,s,r,i){this.type=1,this._$AH=g,this._$AN=void 0,this.element=e,this.name=o,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=g}_$AI(e,o=this,s,r){const i=this.strings;let n=!1;if(i===void 0)e=C(this,e,o,0),n=!M(e)||e!==this._$AH&&e!==_,n&&(this._$AH=e);else{const l=e;let a,u;for(e=i[0],a=0;a<i.length-1;a++)u=C(this,l[s+a],o,a),u===_&&(u=this._$AH[a]),n||=!M(u)||u!==this._$AH[a],u===g?e=g:e!==g&&(e+=(u??"")+i[a+1]),this._$AH[a]=u}n&&!r&&this.j(e)}j(e){e===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Fe extends j{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===g?void 0:e}}class Ye extends j{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==g)}}class Ke extends j{constructor(e,o,s,r,i){super(e,o,s,r,i),this.type=5}_$AI(e,o=this){if((e=C(this,e,o,0)??g)===_)return;const s=this._$AH,r=e===g&&s!==g||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==g&&(s===g||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class qe{constructor(e,o,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}}const Ge=X.litHtmlPolyfillSupport;Ge?.(T,H),(X.litHtmlVersions??=[]).push("3.3.2");const We=(t,e,o)=>{const s=o?.renderBefore??e;let r=s._$litPart$;if(r===void 0){const i=o?.renderBefore??null;s._$litPart$=r=new H(e.insertBefore(I(),i),i,void 0,o??{})}return r._$AI(t),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee=globalThis;let L=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=We(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _}};L._$litElement$=!0,L.finalized=!0,ee.litElementHydrateSupport?.({LitElement:L});const Je=ee.litElementPolyfillSupport;Je?.({LitElement:L});(ee.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xe=t=>(e,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qe={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:J},et=(t=Qe,e,o)=>{const{kind:s,metadata:r}=o;let i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(o.name,t),s==="accessor"){const{name:n}=o;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(n,a,t,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,t,l),l}}}if(s==="setter"){const{name:n}=o;return function(l){const a=this[n];e.call(this,l),this.requestUpdate(n,a,t,!0,l)}}throw Error("Unsupported decorator location: "+s)};function v(t){return(e,o)=>typeof o=="object"?et(t,e,o):((s,r,i)=>{const n=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(t,e,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function f(t){return v({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const tt=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ot(t,e){return(o,s,r)=>{const i=n=>n.renderRoot?.querySelector(t)??null;return tt(o,s,{get(){return i(this)}})}}const st=Le`
  :host {
    --grad: linear-gradient(135deg, #A8107E 0%, #6328A7 100%);
    --grad-soft: linear-gradient(135deg, #f9f0f6 0%, #f3eeff 100%);
    --primary: #A8107E;
    --secondary: #6328A7;
    --radius: 16px;
    font-family: 'Segoe UI', Arial, sans-serif;
    direction: rtl;
  }
  :host([language="eng"]) { direction: ltr; }

  /* ── Native dialog ── */
  dialog {
    border: none;
    padding: 0;
    background: transparent;
    max-width: 960px;
    width: 92vw;
    border-radius: var(--radius);
    overflow: visible;
    box-shadow: 0 24px 80px rgba(99, 40, 167, 0.25);
  }

  /* Open animation */
  @keyframes dialogIn {
    from { opacity: 0; transform: scale(0.96) translateY(-8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  /* Close animation */
  @keyframes dialogOut {
    from { opacity: 1; transform: scale(1)    translateY(0); }
    to   { opacity: 0; transform: scale(0.96) translateY(-8px); }
  }

  dialog[open]:not(.closing) {
    animation: dialogIn 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);
  }
  dialog.closing {
    animation: dialogOut 0.18s ease forwards;
  }

  /* Backdrop */
  @keyframes backdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  dialog::backdrop {
    background: rgba(10, 0, 30, 0.55);
    backdrop-filter: blur(4px);
    animation: backdropIn 0.28s ease;
  }

  /* ── Card – RTL: form on right, image on left ── */
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: var(--radius);
    overflow: hidden;
    background: #fff;
    direction: rtl;
  }
  :host([language="eng"]) .card { direction: ltr; }
  .card.card--legal { grid-template-columns: 1fr; }
  .card.card--legal .image-col { display: none; }
  @media (max-width: 680px) {
    .card { grid-template-columns: 1fr; }
    .image-col { display: none; }
    dialog { width: 96vw; }
  }

  /* ── Embedded mode (no dialog wrapper) ── */
  :host([embedded]) {
    display: block;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
  }
  :host([embedded]) .card {
    box-shadow: none;
  }
  :host([embedded]) .form-col {
    max-height: none;
  }

  /* ── Hide-image mode (form-only, single column) ── */
  :host([hide-image]) .card {
    grid-template-columns: 1fr;
    max-width: 520px;
    margin: 0 auto;
  }
  :host([hide-image]) dialog {
    max-width: 520px;
  }
  .close-btn--floating {
    position: absolute;
    top: 12px;
    left: 14px;
    background: rgba(168,16,126,0.1);
    color: var(--primary);
    border: none;
    border-radius: 50%;
    width: 32px; height: 32px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    line-height: 1;
    transition: background 0.2s;
    z-index: 10;
  }
  .close-btn--floating:hover { background: rgba(168,16,126,0.18); }

  /* ── Dark theme ── */
  :host([dark]) {
    --grad-soft: linear-gradient(135deg, #2a1a2f 0%, #221a3d 100%);
  }
  :host([dark]) .card {
    background: #1a1625;
  }
  :host([dark]) .form-header h2 {
    background: linear-gradient(135deg, #ff4db0 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  :host([dark]) .form-header p {
    color: #a89bb5;
  }
  :host([dark]) label {
    color: #c8bcd9;
  }
  :host([dark]) input[type="text"],
  :host([dark]) input[type="email"],
  :host([dark]) input[type="tel"],
  :host([dark]) input[type="password"] {
    background: #241f33;
    border-color: #3b3449;
    color: #f0e9f7;
  }
  :host([dark]) input[type="text"]::placeholder,
  :host([dark]) input[type="email"]::placeholder,
  :host([dark]) input[type="tel"]::placeholder,
  :host([dark]) input[type="password"]::placeholder {
    color: #6a6079;
  }
  :host([dark]) input:focus {
    background: #2c2540;
    border-color: #a78bfa;
    box-shadow: 0 0 0 3px rgba(167,139,250,0.18);
  }
  :host([dark]) input.valid,
  :host([dark]) input.coupon-valid {
    background: #1a2e26;
    border-color: #22c78e;
  }
  :host([dark]) input.invalid,
  :host([dark]) input.coupon-invalid {
    background: #2e1f1c;
    border-color: #ec6b4a;
  }
  :host([dark]) .generate-pass { color: #6a6079; }
  :host([dark]) .generate-pass:hover { color: #ff4db0; }
  :host([dark]) .toggle-pass { color: #6a6079; }
  :host([dark]) .toggle-pass:hover { color: #a78bfa; }

  :host([dark]) .password-rule {
    background: #241f33;
    color: #6a6079;
    border-color: #3b3449;
  }
  :host([dark]) .password-rule.met {
    background: #1a2e26;
    color: #4ade80;
    border-color: #166534;
  }

  :host([dark]) .coupon-toggle {
    border-color: #4a3a5e;
    color: #c4b5fd;
  }
  :host([dark]) .coupon-toggle:hover,
  :host([dark]) .coupon-toggle.active {
    background: #241f33;
    border-color: #a78bfa;
  }

  :host([dark]) .terms-row {
    background: #241f33;
  }
  :host([dark]) .terms-row.shake {
    border-color: #ec6b4a;
  }
  :host([dark]) .terms-checkbox {
    background: #1a1625;
    border-color: #4a3a5e;
  }
  :host([dark]) .terms-text {
    color: #c8bcd9;
  }
  :host([dark]) .terms-text a {
    color: #ff4db0;
  }

  :host([dark]) .legal-header {
    border-bottom-color: #3b3449;
  }
  :host([dark]) .legal-title {
    background: linear-gradient(135deg, #ff4db0 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  :host([dark]) .legal-back-btn {
    border-color: #4a3a5e;
    color: #c4b5fd;
  }
  :host([dark]) .legal-back-btn:hover {
    background: #241f33;
    border-color: #a78bfa;
  }
  :host([dark]) .legal-body {
    color: #c8bcd9;
  }
  :host([dark]) .legal-body h1,
  :host([dark]) .legal-body h2,
  :host([dark]) .legal-body h3 {
    color: #c4b5fd;
  }
  :host([dark]) .legal-body a {
    color: #ff4db0;
  }

  :host([dark]) .loading-overlay {
    background: rgba(26, 22, 37, 0.92);
  }
  :host([dark]) .loading-text {
    color: #c4b5fd;
  }

  :host([dark]) .close-btn--floating {
    background: rgba(255,255,255,0.08);
    color: #f0e9f7;
  }
  :host([dark]) .close-btn--floating:hover {
    background: rgba(255,255,255,0.16);
  }

  /* ── Image column (visually left in RTL) ── */
  .image-col {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    min-height: 320px;
  }
  .image-tagline {
    position: absolute;
    bottom: 28px;
    left: 0; right: 0;
    text-align: center;
    color: rgba(255,255,255,0.92);
    font-size: 14px;
    font-weight: 500;
    padding: 0 16px;
  }

  /* ── Close button – top-left of image col (RTL) ── */
  .close-btn {
    position: absolute;
    top: 12px;
    left: 14px;
    background: rgba(255,255,255,0.15);
    border: none;
    border-radius: 50%;
    width: 32px; height: 32px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 18px;
    line-height: 1;
    transition: background 0.2s;
    z-index: 10;
  }
  .close-btn:hover { background: rgba(255,255,255,0.3); }
  @media (max-width: 680px) {
    .close-btn {
      top: 10px; left: 10px; right: auto;
      background: rgba(168,16,126,0.1);
      color: var(--primary);
    }
  }

  /* ── Form column ── */
  .form-col {
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 90vh;
  }
  @media (max-width: 680px) {
    .form-col { padding: 28px 20px; }
  }

  /* ── Language toggle ── */
  .lang-toggle {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: 1.5px solid #e0d8f0;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--secondary);
    cursor: pointer;
    font-family: inherit;
    margin-bottom: 10px;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .lang-toggle:hover {
    background: var(--grad-soft);
    border-color: var(--secondary);
  }
  :host([dark]) .lang-toggle {
    border-color: #4a3a5e;
    color: #c4b5fd;
  }
  :host([dark]) .lang-toggle:hover {
    background: #241f33;
    border-color: #a78bfa;
  }

  /* ── Type chip ── */
  .type-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px 4px 8px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .type-chip--business-ai {
    background: #ebe6ff;
    color: #4B2ADA;
    border: 1.5px solid #c4b6f7;
  }
  .type-chip--shabbat {
    background: #fff7e6;
    color: #b07d00;
    border: 1.5px solid #f0d890;
  }

  /* ── Header ── */
  .form-header { margin-bottom: 22px; }
  .form-header h2 {
    margin: 0 0 4px;
    font-size: 22px;
    font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .form-header p {
    margin: 0;
    font-size: 13px;
    color: #888;
  }

  /* ── Fields ── */
  .field { margin-bottom: 14px; }

  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #555;
    margin-bottom: 5px;
    text-align: start;
  }

  .input-wrap { position: relative; }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"] {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 14px;
    padding-inline-end: 60px; /* space for toggle + generate icons */
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    font-size: 15px;
    color: #222;
    background: #fafafa;
    outline: none;
    text-align: start;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  :host(:not([language="eng"])) input[type="text"],
  :host(:not([language="eng"])) input[type="email"],
  :host(:not([language="eng"])) input[type="tel"],
  :host(:not([language="eng"])) input[type="password"] {
    direction: rtl;
  }
  :host([language="eng"]) input[type="text"],
  :host([language="eng"]) input[type="email"],
  :host([language="eng"]) input[type="tel"],
  :host([language="eng"]) input[type="password"] {
    direction: ltr;
  }
  input:focus {
    border-color: var(--secondary);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,40,167,0.1);
  }
  input.valid          { border-color: #22c78e; background: #f3fdf8; }
  input.invalid        { border-color: #ec6b4a; background: #fff8f6; }
  input.coupon-valid   { border-color: #22c78e; background: #f3fdf8; }
  input.coupon-invalid { border-color: #ec6b4a; background: #fff8f6; }

  /* Status icon – at end side (flips with direction) */
  .field-icon {
    position: absolute;
    inset-inline-end: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  .field-icon.valid   { color: #22c78e; }
  .field-icon.invalid { color: #ec6b4a; }

  /* ── Email autocomplete suggestions ── */
  .email-suggestions {
    position: absolute;
    top: 100%;
    left: 0; right: 0;
    margin: 4px 0 0;
    padding: 4px 0;
    list-style: none;
    background: #fff;
    border: 1.5px solid #e0d8f0;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(99, 40, 167, 0.12);
    z-index: 30;
    overflow: hidden;
    animation: suggestionsIn 0.15s ease;
  }
  @keyframes suggestionsIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .email-suggestions li {
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0;
    transition: background 0.12s;
    direction: ltr;
    text-align: left;
  }
  .email-suggestions li:hover,
  .email-suggestions li.active {
    background: var(--grad-soft);
  }
  .email-suggestions li.active {
    font-weight: 600;
  }
  .suggestion-local { color: #555; }
  .suggestion-domain { color: var(--secondary); font-weight: 600; }
  .suggestion-hint {
    margin-inline-start: auto;
    font-size: 10px;
    font-weight: 700;
    color: #aaa;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  :host([dark]) .email-suggestions {
    background: #241f33;
    border-color: #3b3449;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  :host([dark]) .email-suggestions li:hover,
  :host([dark]) .email-suggestions li.active {
    background: #2c2540;
  }
  :host([dark]) .suggestion-local { color: #c8bcd9; }
  :host([dark]) .suggestion-domain { color: #a78bfa; }
  :host([dark]) .suggestion-hint {
    background: #3b3449;
    color: #6a6079;
  }

  /* Generate password button */
  .generate-pass {
    position: absolute;
    inset-inline-end: 36px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #aaa;
    display: flex; align-items: center;
    padding: 0;
    transition: color 0.2s;
  }
  .generate-pass:hover { color: var(--primary); }

  /* Animated gradient border on password generate */
  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes sparkleIconSpin {
    0%   { transform: translateY(-50%) rotate(0deg) scale(1); }
    25%  { transform: translateY(-50%) rotate(90deg) scale(1.3); }
    50%  { transform: translateY(-50%) rotate(180deg) scale(1); }
    75%  { transform: translateY(-50%) rotate(270deg) scale(1.2); }
    100% { transform: translateY(-50%) rotate(360deg) scale(1); }
  }
  .input-wrap.gradient-border input {
    background-image: linear-gradient(90deg, transparent 0%, rgba(168,16,126,0.06) 40%, rgba(99,40,167,0.08) 60%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 1.2s ease-in-out;
  }
  .input-wrap.gradient-border .generate-pass {
    color: var(--primary);
    animation: sparkleIconSpin 0.8s cubic-bezier(0.34,1.4,0.64,1);
  }

  /* Password toggle – at end side (flips with direction) */
  .toggle-pass {
    position: absolute;
    inset-inline-end: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #aaa;
    display: flex; align-items: center;
    padding: 0;
    transition: color 0.2s;
  }
  .toggle-pass:hover { color: var(--secondary); }

  .field-msg {
    font-size: 11px;
    text-align: start;
  }
  .field-msg.err { color: #ec6b4a; }

  @keyframes helloMagic {
    0%   { opacity: 0; transform: translateY(6px) scale(0.75); letter-spacing: -0.5px; }
    55%  { transform: translateY(-3px) scale(1.1); letter-spacing: 0.3px; }
    75%  { transform: translateY(1px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); letter-spacing: normal; }
  }
  .field-msg.ok {
    color: #22c78e;
    display: inline-block;
    animation: helloMagic 0.45s cubic-bezier(0.34, 1.5, 0.64, 1) both;
  }

  /* ── Name star particles ── */
  .star-particle {
    position: absolute;
    pointer-events: none;
    z-index: 50;
    line-height: 1;
    animation: starBurst 0.75s ease-out forwards;
  }
  @keyframes starBurst {
    0%   { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.15) rotate(260deg); }
  }

  /* ── Password rules checklist ── */
  .password-rules {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 6px;
    margin-bottom: 2px;
  }
  .password-rule {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 20px;
    background: #f3f3f3;
    color: #aaa;
    border: 1px solid #e8e8e8;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .password-rule.met {
    background: #f0fdf8;
    color: #16a34a;
    border-color: #bbf7d0;
  }
  .password-rule svg { width: 11px; height: 11px; }

  /* ── Coupon toggle ── */
  .coupon-section { margin-bottom: 14px; }

  .coupon-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1.5px dashed #d0b8e8;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--secondary);
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .coupon-toggle:hover {
    background: var(--grad-soft);
    border-color: var(--secondary);
  }
  .coupon-toggle.active {
    background: var(--grad-soft);
    border-color: var(--secondary);
    border-style: solid;
  }
  .coupon-toggle .chevron {
    transition: transform 0.25s ease;
    margin-right: 2px;
  }
  .coupon-toggle.active .chevron {
    transform: rotate(180deg);
  }

  /* Slide-down reveal */
  .coupon-reveal {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.28s ease;
  }
  .coupon-reveal.open {
    grid-template-rows: 1fr;
  }
  .coupon-inner {
    overflow: hidden;
    padding-top: 0;
    transition: padding-top 0.28s ease;
  }
  .coupon-reveal.open .coupon-inner {
    padding-top: 10px;
  }

  /* ── Terms row ── */
  .terms-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
    padding: 12px;
    border-radius: 10px;
    background: var(--grad-soft);
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;
    user-select: none;
  }
  .terms-row.shake {
    animation: shake 0.4s ease;
    border-color: #ec6b4a;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-5px); }
    40%,80%  { transform: translateX(5px); }
  }

  .terms-checkbox {
    flex-shrink: 0;
    width: 20px; height: 20px;
    border-radius: 6px;
    border: 2px solid #ccc;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, border-color 0.2s;
    margin-top: 1px;
  }
  .terms-checkbox.checked {
    background: var(--grad);
    border-color: transparent;
  }

  .terms-text {
    font-size: 12.5px;
    color: #555;
    line-height: 1.6;
  }
  .terms-text a {
    color: var(--primary);
    text-decoration: underline;
  }

  /* ── Submit button ── */
  .submit-btn {
    width: 100%;
    padding: 14px;
    background: var(--grad);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(168,16,126,0.3);
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    font-family: inherit;
  }
  .submit-btn:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(168,16,126,0.38);
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Login link ── */
  .login-link-row {
    text-align: center;
    margin-top: 12px;
    font-size: 13px;
    color: #666;
  }
  .login-link {
    color: #A8107E;
    font-weight: 600;
    text-decoration: none;
    margin-inline-start: 4px;
  }
  .login-link:hover {
    text-decoration: underline;
  }

  /* ── Legal reading panel ── */
  .legal-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .legal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1.5px solid #ede9f7;
    flex-shrink: 0;
  }

  .legal-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: 1.5px solid #e0d8f0;
    border-radius: 8px;
    padding: 5px 10px 5px 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--secondary);
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s;
  }
  .legal-back-btn:hover {
    background: var(--grad-soft);
    border-color: var(--secondary);
  }
  :host([language="eng"]) .legal-back-btn svg {
    transform: scaleX(-1); /* LTR "back" points left; RTL keeps the right-pointing default */
  }

  .legal-title {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .legal-body {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    max-height: 80vh;
    font-size: 13px;
    line-height: 1.75;
    color: #444;
    padding-inline-end: 4px;
  }
  .legal-body h1, .legal-body h2, .legal-body h3 {
    font-size: 14px;
    font-weight: 700;
    color: var(--secondary);
    margin: 14px 0 6px;
  }
  .legal-body p { margin: 0 0 10px; }
  .legal-body a { color: var(--primary); }
  .legal-body ul, .legal-body ol { padding-inline-start: 20px; padding-inline-end: 0; margin: 0 0 10px; }

  .legal-spinner {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }

  /* ── Loading overlay ── */
  .loading-overlay {
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    background: rgba(255,255,255,0.88);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    z-index: 20;
  }
  .spinner {
    width: 44px; height: 44px;
    border: 4px solid rgba(168,16,126,0.15);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-size: 14px;
    color: var(--secondary);
    font-weight: 500;
  }
`;function rt(t){return t?c`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`:c`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`}function te(){return c`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`}function _e(){return c`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`}function it(){return c`<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <polyline points="2 6 5 9 10 3" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>`}function nt(){return c`<svg width="20" height="22" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 22H23V24H1V22H3V7C3 6.44772 3.44772 6 4 6H14C14.5523 6 15 6.44772 15 7V22H19V14H17V12H20C20.5523 12 21 12.4477 21 13V22ZM5 8V22H13V8H5ZM7 14H11V16H7V14ZM7 10H11V12H7V10Z" fill="currentColor"/>
    <path d="M19.7134 7.12811L19.4668 7.69379C19.2864 8.10792 18.7136 8.10792 18.5331 7.69379L18.2866 7.12811C17.8471 6.11947 17.0554 5.31641 16.0677 4.87708L15.308 4.53922C14.8973 4.35653 14.8973 3.75881 15.308 3.57612L16.0252 3.25714C17.0384 2.80651 17.8442 1.97373 18.2761 0.930828L18.5293 0.319534C18.7058 -0.106511 19.2942 -0.106511 19.4706 0.319534L19.7238 0.930828C20.1558 1.97373 20.9616 2.80651 21.9748 3.25714L22.6919 3.57612C23.1027 3.75881 23.1027 4.35653 22.6919 4.53922L21.9323 4.87708C20.9445 5.31641 20.1529 6.11947 19.7134 7.12811Z" fill="currentColor"/>
  </svg>`}function at(){return c`<svg width="28" height="18" viewBox="0 0 33 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.17157 8.48528C4.60948 6.92319 4.60948 4.39053 6.17157 2.82843L9 0L11.8284 2.82843C13.3905 4.39053 13.3905 6.92319 11.8284 8.48528C11.3039 9.00982 10.6699 9.35821 10 9.53051V11.1538H15C15.5523 11.1538 16 11.6015 16 12.1538V19.1538H18V21.1538H0V19.1538H2V12.1538C2 11.6015 2.44772 11.1538 3 11.1538H8V9.53051C7.3301 9.35821 6.69611 9.00982 6.17157 8.48528ZM7.5858 4.24264C6.80474 5.02369 6.80474 6.29002 7.5858 7.07107C8.3668 7.85212 9.6332 7.85212 10.4142 7.07107C11.1953 6.29002 11.1953 5.02369 10.4142 4.24264L9 2.82843L7.5858 4.24264ZM4 13.1538V19.1538H14V13.1538H4Z" fill="currentColor"/>
    <path d="M21.1716 8.48528C19.6095 6.92319 19.6095 4.39053 21.1716 2.82843L24 0L26.8284 2.82843C28.3905 4.39053 28.3905 6.92319 26.8284 8.48528C26.3039 9.00982 25.6699 9.35821 25 9.53051V11.1538H30C30.5523 11.1538 31 11.6015 31 12.1538V19.1538H33V21.1538H15V19.1538H17V12.1538C17 11.6015 17.4477 11.1538 18 11.1538H23V9.53051C22.3301 9.35821 21.6961 9.00982 21.1716 8.48528ZM22.5858 4.24264C21.8047 5.02369 21.8047 6.29002 22.5858 7.07107C23.3668 7.85212 24.6332 7.85212 25.4142 7.07107C26.1953 6.29002 26.1953 5.02369 25.4142 4.24264L24 2.82843L22.5858 4.24264ZM19 13.1538V19.1538H29V13.1538H19Z" fill="currentColor"/>
  </svg>`}const lt=""+new URL("Creativity3-CYN1OmO2.png",import.meta.url).href,dt=""+new URL("shomerShabbat-qctI8VS4.png",import.meta.url).href,ct=""+new URL("ragil-Ds4oyhUr.png",import.meta.url).href,ht=["getfree500"];function F(t){return/^[a-zA-Z0-9][\+\w\.-]*@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(t)}function Y(t){const e=t.replace(/[\s\-]/g,"");return/^(\+?972|0)(5[0-9]\d{7}|[2-9]\d{7})$/.test(e)}function B(t){return/^[א-תa-zA-Z0-9\s]{2,}$/.test(t)}function K(t){return/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\.\)\(\}\{\]\[_-])[A-Za-z\d@$!%*?&#\.\)\(\}\{\]\[_-]{8,18}$/.test(t)}function ue(t,e=ht){return t?e.includes(t.trim().toLowerCase())?"valid":"invalid":"idle"}function pt(t){return{fullname:{validate:B,err:t.errName,ok:e=>t.okName(e.split(" ")[0])},email:{validate:F,err:t.errEmail,ok:()=>t.okEmail},phone:{validate:Y,err:t.errPhone,ok:()=>t.okPhone},password:{validate:K,err:t.errPassword,ok:()=>t.okPassword}}}const ut="https://api4.sendmsg.co.il/signupHandler.aspx/addUserV3",gt="sendmsg.co.il",ft=30;function mt(t){const e=new URLSearchParams(window.location.search);return{coupon:t.couponValid?t.coupon:"",Ref:e.get("ref")??"",utm_source:e.get("utm_source")??"",utm_medium:e.get("utm_medium")??"",utm_content:e.get("utm_content")??"",utm_campaign:e.get("utm_campaign")??"",adset_name:e.get("adset_name")??"",traffic_source:e.get("traffic_source")??"",firstName:t.fullname,email:t.email,phone:t.phone,passOrID:t.password,platform:"form",language:t.language,senderUrl:window.location.hostname,sentDomainID:"0",siteID:e.get("sid")??t.siteID,urlRef:window.location.href,extraData:{openKosherAccount:t.openKosherAccount,businessAI:t.businessAI}}}async function bt(t){return(await(await fetch(ut,{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify(t)})).json()).d}const vt=["UserAdded","googleAccountAlreadyUsed","facebookAccountAlreadyUsed"];function yt(t){return{InvalidEmail:t.srvInvalidEmail,InvalidPhone:t.srvInvalidPhone,EmailAlreadyExists:t.srvEmailExists,InvalidFirstName:t.srvInvalidFirstName,InvalidPassword:t.srvInvalidPassword}}function wt(t){const e=t.split("___"),o=new Date(Date.now()+ft*864e5).toUTCString();document.cookie=`sendMsg=user=${e[1]}&ID=${e[2]}&Lang=${e[3]}; expires=${o}; domain=${gt}; path=/`;const s=e[4]??"";window.location.href=`https://panel.sendmsg.co.il/admin.aspx?cat=4&newLogin=true${s}`}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt={CHILD:2},$t=t=>(...e)=>({_$litDirective$:t,values:e});class kt{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,s){this._$Ct=e,this._$AM=o,this._$Ci=s}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class q extends kt{constructor(e){if(super(e),this.it=g,e.type!==xt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===g||e==null)return this._t=void 0,this.it=e;if(e===_)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const o=[e];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}}q.directiveName="unsafeHTML",q.resultType=1;const _t=$t(q);function At(t,e){if(!t)return c``;const o=[{label:e.ruleMinChars,met:t.length>=8},{label:e.ruleLower,met:/[a-z]/.test(t)},{label:e.ruleUpper,met:/[A-Z]/.test(t)},{label:e.ruleSpecial,met:/[@$!%*?&#.\)\(\}\{\]\[_\-]/.test(t)},{label:e.ruleDigit,met:/\d/.test(t)}];return c`
    <div class="password-rules">
      ${o.map(s=>c`
        <span class="password-rule ${s.met?"met":""}">
          ${s.met?te():""}
          ${s.label}
        </span>
      `)}
    </div>
  `}function U(t,e,o,s,r){const i=e(t.field),n=t.emailSuggestions??[];return c`
    <div class="field">
      <label for=${t.id}>${t.label}</label>
      <div class="input-wrap ${t.wrapClass??""}">
        <input
          id=${t.id}
          type=${t.type}
          autocomplete=${n.length?"off":t.autocomplete??"off"}
          placeholder=${t.placeholder}
          .value=${t.value}
          class=${i}
          @input=${l=>{const a=l.target.value;t.onInput(a),o(t.field,a)}}
          @blur=${()=>{o(t.field,t.value),t.onBlurNative?.()}}
          @keydown=${t.onKeydown?l=>t.onKeydown(l):null}
        />
        ${t.extra??""}
        ${!t.extra&&i==="valid"?c`<span class="field-icon valid">${te()}</span>`:""}
        ${!t.extra&&i==="invalid"?c`<span class="field-icon invalid">${_e()}</span>`:""}
        ${n.length?c`
          <ul class="email-suggestions" role="listbox">
            ${n.map((l,a)=>{const u=l.indexOf("@"),m=l.slice(0,u),p=l.slice(u);return c`
                <li role="option"
                  class=${a===(t.emailSuggestionIndex??0)?"active":""}
                  aria-selected=${a===(t.emailSuggestionIndex??0)}
                  @mousedown=${b=>{b.preventDefault(),t.onEmailSuggestionClick?.(l)}}>
                  <span class="suggestion-local">${m}</span><span class="suggestion-domain">${p}</span>
                  ${a===(t.emailSuggestionIndex??0)?c`<span class="suggestion-hint">Tab</span>`:""}
                </li>`})}
          </ul>
        `:""}
      </div>
      <div class="field-msg ${i==="valid"?"ok":i==="invalid"?"err":""}">
        ${s[t.field]??r[t.field]??""}
      </div>
    </div>
  `}function Ct(t,e){const o=t.status;return c`
    <div class="coupon-section">
      <button type="button" class="coupon-toggle ${t.showCoupon?"active":""}"
        style=${t.showCoupon?"display:none":""}
        @click=${t.onToggle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
        ${e.haveCoupon}
        <svg class="chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <div class="coupon-reveal ${t.showCoupon?"open":""}">
        <div class="coupon-inner">
          <div class="field" style="margin-bottom:0">
            <div class="input-wrap">
              <input
                id="reg-coupon" type="text"
                autocomplete="off"
                placeholder=${e.couponPlaceholder}
                .value=${t.coupon}
                class=${o==="valid"?"coupon-valid":o==="invalid"?"coupon-invalid":""}
                @input=${s=>t.onInput(s.target.value)}
                @blur=${t.onBlur}
              />
              ${o==="valid"?c`<span class="field-icon valid">${te()}</span>`:""}
              ${o==="invalid"?c`<span class="field-icon invalid">${_e()}</span>`:""}
            </div>
            <div class="field-msg ${o==="valid"?"ok":o==="invalid"?"err":""}">
              ${o==="valid"?e.couponValid:o==="invalid"?e.couponInvalid:""}
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function St(t,e){const o=t.legalView==="terms"?e.termsTitle:e.privacyTitle;return c`
    <div class="legal-panel">
      <div class="legal-header">
        <h3 class="legal-title">${o}</h3>
        <button class="legal-back-btn" @click=${t.onBack} aria-label=${e.legalBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          ${e.legalBack}
        </button>
      </div>
      <div class="legal-body">
        ${t.legalLoading?c`<div class="legal-spinner"><div class="spinner"></div></div>`:_t(t.legalContent)}
      </div>
    </div>
  `}async function Et(t){const r=(await(await fetch(`https://www.sendmsg.co.il/wp-json/wp/v2/pages?slug=${t==="terms"?"terms":"privacy"}`)).json())[0]?.content?.rendered??"",i=new DOMParser().parseFromString(r,"text/html");return i.querySelectorAll("svg").forEach(n=>n.remove()),i.body.innerHTML}const Pt={dir:"rtl",title:"יוצרים חשבון, זה לוקח רגע",subtitle:"הצטרפו לאלפי עסקים שכבר שולחים איתנו",shabbatBadge:"שומר שבת",fullnameLabel:"שם מלא",fullnamePlaceholder:"ישראל ישראלי",emailLabel:"כתובת אימייל",emailPlaceholder:"you@example.com",phoneLabel:"מספר טלפון",phonePlaceholder:"050-000-0000",passwordLabel:"סיסמה",passwordPlaceholder:"בחרו סיסמה חזקה — לפחות 8 תווים, אות גדולה, ספרה ותו מיוחד",showPassword:"הצגת סיסמה",hidePassword:"הסתרת סיסמה",generatePassword:"תייצרו לי סיסמה",agreePrefix:"קראתי ואני מאשר/ת את",termsLink:"תנאי השימוש",agreeAnd:"ו",privacyLink:"מדיניות הפרטיות",submit:"יוצרים חשבון בחינם",loading:"עוד רגע… מקימים לכם את החשבון החדש",haveCoupon:"יש לכם קוד קופון?",couponPlaceholder:"הקלידו את קוד הקופון",couponValid:"הקופון הוחל בהצלחה!",couponInvalid:"הקוד לא נמצא, כדאי לבדוק שוב",couponInvalidAlert:"אופס! הקופון שהזנתם אינו תקין. ודאו שהוא נכתב ללא רווחים.",submitError:"משהו השתבש אצלנו. נסו שוב בבקשה.",termsTitle:"תנאי השימוש",privacyTitle:"מדיניות הפרטיות",legalBack:"חזרה",legalLoadError:"לא הצלחנו לטעון את התוכן כרגע.",closeAria:"סגירה",switchLangAria:"Switch to English",switchLangLabel:"English",ruleMinChars:"לפחות 8 תווים",ruleLower:"אות קטנה (a–z)",ruleUpper:"אות גדולה (A–Z)",ruleSpecial:"תו מיוחד (?,@…)",ruleDigit:"ספרה (0–9)",errName:"השם צריך להכיל לפחות 2 תווים, בלי סימנים מיוחדים",okName:t=>`היי ${t}, נעים להכיר!`,errEmail:"כתובת המייל לא נראית תקינה",okEmail:"מצוין, הכתובת תשמש כשם המשתמש שלכם",errPhone:"מספר הטלפון לא נראה תקין",okPhone:"מעולה, המספר תקין",errPassword:"הסיסמה צריכה: 8–18 תווים, אות גדולה, קטנה, ספרה ותו מיוחד",okPassword:"סיסמה חזקה, רק אל תשכחו אותה!",srvInvalidEmail:"כתובת המייל לא נראית תקינה",srvInvalidPhone:"מספר הטלפון לא נראה תקין",srvEmailExists:"הכתובת הזו כבר רשומה אצלנו",srvInvalidFirstName:"השם לא תקין",srvInvalidPassword:"הסיסמה לא תקינה",srvGenericError:t=>`נתקלנו בשגיאה בהרשמה: ${t}`,alreadyHaveAccount:"כבר יש לכם חשבון?",loginHere:"התחברו כאן"},Lt={dir:"ltr",title:"Sign up free now",subtitle:"Join thousands of businesses using SendMsg",shabbatBadge:"Shabbat observant",fullnameLabel:"Full name",fullnamePlaceholder:"John Doe",emailLabel:"Email address",emailPlaceholder:"you@example.com",phoneLabel:"Phone number",phonePlaceholder:"050-000-0000",passwordLabel:"Password",passwordPlaceholder:"At least 8 chars, uppercase, digit, special char",showPassword:"Show password",hidePassword:"Hide password",generatePassword:"Generate password",agreePrefix:"I agree to the",termsLink:"Terms of Service",agreeAnd:" and ",privacyLink:"Privacy Policy",submit:"Create free account",loading:"Just a moment… setting up your new account",haveCoupon:"I have a coupon code",couponPlaceholder:"Enter coupon code",couponValid:"Coupon applied successfully!",couponInvalid:"Invalid coupon code",couponInvalidAlert:"Oops! The coupon you entered is invalid. Please check for typos.",submitError:"Something went wrong. Please try again.",termsTitle:"Terms of Service",privacyTitle:"Privacy Policy",legalBack:"Back",legalLoadError:"Unable to load content right now.",closeAria:"Close",switchLangAria:"החלף לעברית",switchLangLabel:"עברית",ruleMinChars:"At least 8 characters",ruleLower:"Lowercase (a–z)",ruleUpper:"Uppercase (A–Z)",ruleSpecial:"Special char (?,@…)",ruleDigit:"Digit (0–9)",errName:"Name must be at least 2 characters, no special symbols",okName:t=>`Hi ${t}, nice to meet you!`,errEmail:"Invalid email address",okEmail:"Looks good — this will be your username",errPhone:"Invalid phone number",okPhone:"Number is valid!",errPassword:"Password must be 8–18 chars with upper, lower, digit and special char",okPassword:"Strong password — don't forget it!",srvInvalidEmail:"Invalid email address",srvInvalidPhone:"Invalid phone number",srvEmailExists:"This email is already registered",srvInvalidFirstName:"Invalid name",srvInvalidPassword:"Invalid password",srvGenericError:t=>`Registration error: ${t}`,alreadyHaveAccount:"Already have an account?",loginHere:"Log in here"},ge={heb:Pt,eng:Lt};function It(t){return t==="eng"?ge.eng:ge.heb}const Ae="abcdefghijklmnopqrstuvwxyz",Ce="ABCDEFGHIJKLMNOPQRSTUVWXYZ",Se="0123456789",Ee="@$!%*?&#._-",Mt=Ae+Ce+Se+Ee;function E(t){return t[Math.floor(Math.random()*t.length)]}function Tt(){const t=[E(Ae),E(Ce),E(Se),E(Ee)];for(let e=0;e<8;e++)t.push(E(Mt));for(let e=t.length-1;e>0;e--){const o=Math.floor(Math.random()*(e+1));[t[e],t[o]]=[t[o],t[e]]}return t.join("")}let N=null;function Ht(t){const e=Tt();t.setShowPassword(!0),t.setGenerating(!0),N&&clearTimeout(N);let o=0;const s=()=>{o++,t.setPassword(e.slice(0,o)),o<e.length?N=setTimeout(s,40+Math.random()*30):(t.onComplete(e),N=setTimeout(()=>{t.setGenerating(!1)},600))};t.setPassword(""),s()}const fe=["gmail.com","yahoo.com","outlook.com","hotmail.com","icloud.com","walla.co.il","walla.com","live.com","msn.com","aol.com","mail.com","protonmail.com","zoho.com","yandex.com"];function Ot(t){const e=t.indexOf("@");if(e<1)return{suggestions:[],index:0};const o=t.slice(e+1).toLowerCase();if(o.length>0&&fe.some(i=>i===o))return{suggestions:[],index:0};const s=t.slice(0,e+1);return{suggestions:fe.filter(i=>i.startsWith(o)).slice(0,5).map(i=>s+i),index:0}}function Ut(t,e,o,s,r,i){return e.length?t.key==="Tab"||t.key==="Enter"?(t.preventDefault(),s(e[o]),!0):t.key==="ArrowDown"?(t.preventDefault(),i((o+1)%e.length),!0):t.key==="ArrowUp"?(t.preventDefault(),i((o-1+e.length)%e.length),!0):t.key==="Escape"?(r(),!0):!1:!1}const me=["✦","✧","★","⋆","✸"],be=["#22c78e","#a8107e","#6328a7","#ffd700","#ff6bb5","#60c8ff"],ve=14;function Nt(t,e){const o=t.getBoundingClientRect(),s=e.getBoundingClientRect(),r=o.left-s.left+o.width*.25,i=o.top-s.top+o.height/2;for(let n=0;n<ve;n++){const l=document.createElement("span");l.className="star-particle",l.textContent=me[Math.floor(Math.random()*me.length)];const a=Math.PI*2*n/ve+(Math.random()-.5)*.6,u=28+Math.random()*52;l.style.cssText=`left:${r}px;top:${i}px;font-size:${7+Math.random()*9}px;color:${be[Math.floor(Math.random()*be.length)]};--dx:${(Math.cos(a)*u).toFixed(1)}px;--dy:${(Math.sin(a)*u-10).toFixed(1)}px;animation-delay:${(Math.random()*.12).toFixed(3)}s`,e.appendChild(l),l.addEventListener("animationend",()=>l.remove(),{once:!0})}}var Rt=Object.defineProperty,Bt=Object.getOwnPropertyDescriptor,h=(t,e,o,s)=>{for(var r=s>1?void 0:s?Bt(e,o):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(r=(s?n(e,o,r):n(r))||r);return s&&r&&Rt(e,o,r),r};let d=class extends L{constructor(){super(...arguments),this.isOpen=!1,this.embedded=!1,this.hideImage=!1,this.dark=!1,this.openKosherAccount=!1,this.businessAI=!1,this.siteID="0",this.language="heb",this.imageUrl="",this.fullname="",this.email="",this.phone="",this.password="",this.coupon="",this.agreedToTerms=!1,this.showPassword=!1,this.passwordGenerating=!1,this.loading=!1,this.couponStatus="idle",this.showCoupon=!1,this.errors={},this.fieldSuccess={},this.legalView=null,this.legalContent="",this.legalLoading=!1,this.formColMinHeight=null,this.emailSuggestions=[],this.emailSuggestionIndex=0,this._nameStarsFired=!1}get t(){return It(this.language)}get blurConfigs(){return pt(this.t)}toggleLanguage(){this.language=this.language==="eng"?"heb":"eng",this.fullname&&this.onBlur("fullname",this.fullname),this.email&&this.onBlur("email",this.email),this.phone&&this.onBlur("phone",this.phone),this.password&&this.onBlur("password",this.password)}connectedCallback(){super.connectedCallback();const t=new URLSearchParams(window.location.search),e=t.get("email"),o=t.get("name")??t.get("firstName"),s=t.get("phone");e&&(this.email=e),o&&(this.fullname=o),s&&(this.phone=s)}updated(t){this.embedded||t.has("isOpen")&&(this.isOpen?this.dialogEl?.showModal():this.dialogEl?.close())}_trySpawnNameStars(){this._nameStarsFired||!B(this.fullname)||(this._nameStarsFired=!0,this.updateComplete.then(()=>{const t=this.shadowRoot?.querySelector(".field-msg.ok"),e=this.shadowRoot?.querySelector(".card");t&&e&&Nt(t,e)}))}_generatePassword(){Ht({setPassword:t=>{this.password=t},setShowPassword:t=>{this.showPassword=t},setGenerating:t=>{this.passwordGenerating=t},onComplete:t=>{this.onBlur("password",t)}})}open(){this.isOpen=!0}toggle(){this.isOpen?this.close():this.open()}close(){const t=this.dialogEl;if(!t||!this.isOpen)return;t.classList.add("closing");const e=o=>{o.target===t&&(t.removeEventListener("animationend",e),t.classList.remove("closing"),this.isOpen=!1)};t.addEventListener("animationend",e)}get isFormValid(){return B(this.fullname)&&F(this.email)&&Y(this.phone)&&K(this.password)&&this.agreedToTerms&&this.couponStatus!=="invalid"}updateEmailSuggestions(t){const e=Ot(t);this.emailSuggestions=e.suggestions,this.emailSuggestionIndex=e.index}acceptEmailSuggestion(t){this.email=t,this.emailSuggestions=[],this.onBlur("email",t)}_handleEmailKeydown(t){Ut(t,this.emailSuggestions,this.emailSuggestionIndex,e=>this.acceptEmailSuggestion(e),()=>{this.emailSuggestions=[]},e=>{this.emailSuggestionIndex=e})}getFieldState(t){return this.errors[t]?"invalid":this.fieldSuccess[t]?"valid":""}onBlur(t,e){if(!e){const{[t]:s,...r}=this.errors;this.errors=r;const{[t]:i,...n}=this.fieldSuccess;this.fieldSuccess=n;return}const o=this.blurConfigs[t];if(o)if(o.validate(e)){const{[t]:s,...r}=this.errors;this.errors=r,this.fieldSuccess={...this.fieldSuccess,[t]:o.ok(e)}}else{const{[t]:s,...r}=this.fieldSuccess;this.fieldSuccess=r,this.errors={...this.errors,[t]:o.err}}}async handleSubmit(t){t.preventDefault();const e=this.t;if(this.onBlur("fullname",this.fullname),this.onBlur("email",this.email),this.onBlur("phone",this.phone),this.onBlur("password",this.password),!this.agreedToTerms){const r=this.shadowRoot?.querySelector(".terms-row");r?.classList.remove("shake"),r?.offsetWidth,r?.classList.add("shake");return}if(this.couponStatus==="invalid"){alert(e.couponInvalidAlert);return}if(Object.keys(this.errors).length>0||!B(this.fullname)||!F(this.email)||!Y(this.phone)||!K(this.password))return;this.loading=!0;const s=mt({fullname:this.fullname,email:this.email,phone:this.phone,password:this.password,coupon:this.coupon,couponValid:this.couponStatus==="valid",language:this.language,siteID:this.siteID,openKosherAccount:this.openKosherAccount,businessAI:this.businessAI});try{const r=await bt(s);if(vt.some(i=>r.includes(i)))wt(r);else{const i=r.split("|")[0],n=yt(e);alert(n[i]??e.srvGenericError(i))}}catch{alert(e.submitError)}finally{this.loading=!1}}onDialogClick(t){t.target===this.dialogEl&&this.close()}onCancel(t){t.preventDefault(),this.close()}async showLegal(t,e){e.preventDefault(),e.stopPropagation();const o=this.shadowRoot?.querySelector(".form-col");o&&(this.formColMinHeight=o.offsetHeight),this.legalView=t,this.legalLoading=!0,this.legalContent="";try{this.legalContent=await Et(t)}catch{this.legalContent=`<p>${this.t.legalLoadError}</p>`}finally{this.legalLoading=!1}}renderCard(){const t=this.t,e=[this.getFieldState.bind(this),this.onBlur.bind(this),this.errors,this.fieldSuccess];return c`
        <div class="card ${this.legalView?"card--legal":""}" style="position:relative">

          ${this.loading?c`
            <div class="loading-overlay">
              <div class="spinner"></div>
              <div class="loading-text">${t.loading}</div>
            </div>`:""}

          <!-- Form column (right in RTL) -->
          <div class="form-col" style=${this.formColMinHeight!=null?`min-height:${this.formColMinHeight}px`:""}>
            ${this.legalView?St({legalView:this.legalView,legalLoading:this.legalLoading,legalContent:this.legalContent,onBack:()=>{this.legalView=null,this.formColMinHeight=null}},t):c`
            <div class="form-header">
              ${this.openKosherAccount?c`
                <div class="type-chip type-chip--shabbat">
                  ${at()}
                  <span>${t.shabbatBadge}</span>
                </div>`:this.businessAI?c`
                <div class="type-chip type-chip--business-ai">
                  ${nt()}
                  <span>Business AI</span>
                </div>`:""}
              <h2>${t.title}</h2>
              <p>${t.subtitle}</p>
            </div>

            <form @submit=${this.handleSubmit} novalidate>

              ${U({id:"reg-fullname",field:"fullname",label:t.fullnameLabel,type:"text",placeholder:t.fullnamePlaceholder,value:this.fullname,autocomplete:"name",onInput:o=>{this.fullname=o,this._nameStarsFired=!1},onBlurNative:()=>this._trySpawnNameStars(),onKeydown:o=>{o.key===" "&&this._trySpawnNameStars()}},...e)}

              ${U({id:"reg-email",field:"email",label:t.emailLabel,type:"email",placeholder:t.emailPlaceholder,value:this.email,autocomplete:"email",onInput:o=>{this.email=o,this.updateEmailSuggestions(o)},onKeydown:o=>this._handleEmailKeydown(o),onBlurNative:()=>{setTimeout(()=>{this.emailSuggestions=[]},150)},emailSuggestions:this.emailSuggestions,emailSuggestionIndex:this.emailSuggestionIndex,onEmailSuggestionClick:o=>this.acceptEmailSuggestion(o)},...e)}

              ${U({id:"reg-phone",field:"phone",label:t.phoneLabel,type:"tel",placeholder:t.phonePlaceholder,value:this.phone,autocomplete:"tel",onInput:o=>{this.phone=o}},...e)}

              ${U({id:"reg-password",field:"password",label:t.passwordLabel,type:this.showPassword?"text":"password",placeholder:t.passwordPlaceholder,value:this.password,autocomplete:"off",onInput:o=>{this.password=o},wrapClass:this.passwordGenerating?"gradient-border":"",extra:c`
                  <button type="button" class="generate-pass"
                    @click=${()=>{this._generatePassword()}}
                    aria-label=${t.generatePassword}
                    title=${t.generatePassword}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 3C20.2091 3 22 4.79086 22 7V17C22 19.2091 20.2091 21 18 21H6C3.79086 21 2 19.2091 2 17V7C2 4.79086 3.79086 3 6 3H18ZM6 5C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6ZM11.4121 7.39941C11.6327 6.86708 12.3673 6.86706 12.5879 7.39941L12.9043 8.16309C13.4442 9.46657 14.4522 10.5081 15.7188 11.0713L16.6152 11.4697C17.1284 11.6982 17.1285 12.4455 16.6152 12.6738L15.665 13.0957C14.4305 13.6448 13.4409 14.6486 12.8916 15.9092L12.584 16.6162C12.3584 17.1338 11.6416 17.1338 11.416 16.6162L11.1084 15.9092C10.5591 14.6486 9.56954 13.6448 8.33496 13.0957L7.38477 12.6738C6.87153 12.4455 6.87165 11.6982 7.38477 11.4697L8.28125 11.0713C9.54772 10.5081 10.5548 9.46657 11.0947 8.16309L11.4121 7.39941Z"/></svg>
                  </button>
                  <button type="button" class="toggle-pass"
                    @click=${()=>{this.showPassword=!this.showPassword}}
                    aria-label=${this.showPassword?t.hidePassword:t.showPassword}>
                    ${rt(this.showPassword)}
                  </button>`},...e)}

              ${At(this.password,t)}

              ${Ct({coupon:this.coupon,status:this.couponStatus,showCoupon:this.showCoupon,onToggle:()=>{this.showCoupon=!this.showCoupon,this.showCoupon&&this.updateComplete.then(()=>{this.shadowRoot?.querySelector("#reg-coupon")?.focus()})},onInput:o=>{this.coupon=o,this.couponStatus=ue(o)},onBlur:()=>{this.couponStatus=ue(this.coupon)}},t)}

              <!-- Terms -->
              <div class="terms-row" @click=${()=>{this.agreedToTerms=!this.agreedToTerms}}>
                <div class="terms-checkbox ${this.agreedToTerms?"checked":""}">
                  ${this.agreedToTerms?it():""}
                </div>

                <div class="terms-text">
                  ${t.agreePrefix}
                  <a href="#" @click=${o=>this.showLegal("terms",o)}>${t.termsLink}</a>${" "}${t.agreeAnd}<a href="#" @click=${o=>this.showLegal("privacy",o)}>${t.privacyLink}</a>
                </div>
              </div>

              <button type="submit" class="submit-btn" ?disabled=${this.loading||!this.isFormValid}>
                ${t.submit}
              </button>

              <div class="login-link-row">
                ${t.alreadyHaveAccount}
                <a href="https://panel.sendmsg.co.il/${window.location.search}" class="login-link">${t.loginHere}</a>
              </div>

            </form>
            `}
          </div>

          <!-- Image column (left in RTL) -->
          ${this.hideImage?this.embedded?"":c`
            <button class="close-btn close-btn--floating" @click=${()=>this.close()} aria-label=${t.closeAria}>✕</button>
          `:c`
          <div class="image-col" style="background-image: url(${this.imageUrl||(this.openKosherAccount?dt:this.businessAI?lt:ct)})">
            ${this.embedded?"":c`<button class="close-btn" @click=${()=>this.close()} aria-label=${t.closeAria}>✕</button>`}
            <!-- <div class="image-tagline">פלטפורמת המסרים החזקה ביותר לעסק שלך</div> -->
          </div>`}

        </div>
    `}render(){return this.embedded?this.renderCard():c`
      <dialog @click=${this.onDialogClick} @cancel=${this.onCancel}>
        ${this.renderCard()}
      </dialog>
    `}};d.styles=st;h([v({type:Boolean,reflect:!0})],d.prototype,"isOpen",2);h([v({type:Boolean,reflect:!0})],d.prototype,"embedded",2);h([v({type:Boolean,reflect:!0,attribute:"hide-image"})],d.prototype,"hideImage",2);h([v({type:Boolean,reflect:!0})],d.prototype,"dark",2);h([v({type:Boolean,attribute:"open-kosher-account"})],d.prototype,"openKosherAccount",2);h([v({type:Boolean,attribute:"business-ai"})],d.prototype,"businessAI",2);h([v({type:String,attribute:"site-id"})],d.prototype,"siteID",2);h([v({type:String,reflect:!0})],d.prototype,"language",2);h([v({type:String,attribute:"image-url"})],d.prototype,"imageUrl",2);h([f()],d.prototype,"fullname",2);h([f()],d.prototype,"email",2);h([f()],d.prototype,"phone",2);h([f()],d.prototype,"password",2);h([f()],d.prototype,"coupon",2);h([f()],d.prototype,"agreedToTerms",2);h([f()],d.prototype,"showPassword",2);h([f()],d.prototype,"passwordGenerating",2);h([f()],d.prototype,"loading",2);h([f()],d.prototype,"couponStatus",2);h([f()],d.prototype,"showCoupon",2);h([f()],d.prototype,"errors",2);h([f()],d.prototype,"fieldSuccess",2);h([f()],d.prototype,"legalView",2);h([f()],d.prototype,"legalContent",2);h([f()],d.prototype,"legalLoading",2);h([f()],d.prototype,"formColMinHeight",2);h([f()],d.prototype,"emailSuggestions",2);h([f()],d.prototype,"emailSuggestionIndex",2);h([ot("dialog")],d.prototype,"dialogEl",2);d=h([Xe("sendmsg-register")],d);
