var B=Object.defineProperty;var H=(o,t,e)=>t in o?B(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var w=(o,t,e)=>(H(o,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();class E{constructor(){this.objmap=new Map,this.head=null,this.tail=null,this.length=0}get size(){return this.objmap.size}push_back(t){this.has(t)&&this.delete(t);let e={prev:null,next:null,elem:t};this.objmap.set(t,e),this.tail===null?(this.head=e,this.tail=e):(this.tail.next=e,e.prev=this.tail,this.tail=e)}pop_back(){let t=this.tail;return t===null?(console.log("warning: trying to pop an empty list"),!1):(this.tail=t.prev,this.tail.next=null,this.objmap.delete(t.elem),t.elem)}push_front(t){this.has(t)&&this.delete(t),console.log("inserting front: ",t),this.head===null?this.push(t):this.insertBefore(t,this.head.elem)}pop_front(){if(this.head===null)return null;{let t=this.head.elem;return this.delete(t),t}}delete(t){if(!this.objmap.has(t))return console.log("warning: trying to delete an empty element"),!1;let e=this.objmap.get(t);e.prev===null?this.head=e.next:e.prev.next=e.next,e.next===null?this.tail=e.prev:e.next.prev=e.prev,this.objmap.delete(t)}has(t){return this.objmap.has(t)}getNext(t){if(!this.objmap.has(t))throw new Error("Error: trying to get an element that does not exist");let e=this.objmap.get(t);return e.next===null?null:e.next.elem}getPrev(t){if(!this.objmap.has(t))throw new Error("Error: trying to get an element that does not exist");let e=this.objmap.get(t);return e.prev===null?null:e.prev.elem}getHead(){return this.head===null?null:this.head.elem}getTail(){return this.tail===null?null:this.tail.elem}insertBefore(t,e){if(!this.objmap.has(e))return console.log("warning: trying to insert before a non-member element"),!1;if(t===e)return console.log("Warning: trying to insert before itself"),!1;this.has(t)&&this.delete(t);let s=this.objmap.get(e),r={prev:s.prev,next:s,elem:t};this.objmap.set(t,r);let n=s.prev;s.prev=r,n===null?this.head=r:n.next=r}insertAfter(t,e){if(!this.objmap.has(t))return console.log("warning: trying to insert after a non-member element"),!1;if(t===e)return console.log("Warning: trying to insert after itself"),!1;this.has(e)&&this.delete(e);let s=this.objmap.get(t),r={prev:s,next:s.next,elem:e};this.objmap.set(e,r);let n=s.next;s.next=r,n===null?this.tail=r:n.prev=r}foreach(t){let e=this.head;for(;e!==null;){let s=e.next;t(e.elem),e=s}}clear(){this.head=null,this.tail=null,this.objmap.clear()}replace(t,e){let s=this.objmap.get(t);return s.elem=e,this.objmap.delete(t),this.objmap.set(e,s),t}toArray(){let t=[];return this.foreach(e=>{t.push(e)}),t}[Symbol.iterator](){let t=this.head;return{next:()=>{if(t===null)return{done:!0};let e=t;return t=t.next,{value:e.elem,done:!1}}}}*loopRange(t,e){if(this.head===null)return;let s=this.objmap.get(t);for(;s!==null&&s.elem!==e;){let r=s.next;yield s.elem,s=r}}loop(){return this.loopRange(this.getHead(),null)}loopUntil(t){return this.loopRange(this.getHead(),t)}loopFrom(t){return this.loopRange(t,null)}*loopReverseRange(t,e){if(this.head===null)return;let s=this.objmap.get(t);for(;s!==null&&s.elem!==e;){let r=s.prev;yield s.elem,s=r}}loopReverse(){return this.loopReverseRange(this.getTail(),null)}loopReverseUntil(t){return this.loopReverseRange(this.getTail(),t)}loopReverseFrom(t){return this.loopReverseRange(t,null)}getNth(t){if(t>=this.size||t<0)return null;let e=this.head;for(let s=0;s<t;s++)e=e.next;return e.elem}}E.prototype.push=E.prototype.push_back;E.prototype.pop=E.prototype.pop_back;let N=function(o){let t=[["",""]],e=0;for(let s=0;s<o.length;s++){let r=t.pop(),n=o[s];n==="_"?(r[e]+=o[s+1],s++,t.push(r)):n===":"?(e++,t.push(r)):n===";"?(e=0,t.push(r),t.push(["",""])):(r[e]+=o[s],t.push(r))}return t=t.map(([s,r])=>[s.trim(),r.trim()]).filter(s=>s[0]!==""),t},X=function(o,t,e,s){return o instanceof x?o:new this.Child_Constructor(o,t,e,s)};class G{constructor(t){this.emap=new Map,this.objmap=new Map}get size(){return this.objmap.size}set(t,e){return this.emap.set(t.e,t),this.objmap.set(t,e)}delete(t){return this.emap.delete(t.e),this.objmap.delete(t)}clear(){return this.emap.clear(),this.objmap.clear()}has(t){return this.objmap.has(t)}get(t){return this.objmap.get(t)}getInstance(t){return this.emap.get(t)}}class W extends E{constructor(){super(),super.objmap=new G(super.objmap)}getInstance(t){return this.objmap.getInstance(t)}}const C=class C{constructor(t,e,s,r){w(this,"nodeType",1);w(this,"parent",null);w(this,"Child_Constructor",C);w(this,"attrParser",N);w(this,"getELEM",X);if(this.children=new W,t==="text"){this.e=document.createTextNode(e),this.nodeType=3;return}else if(typeof t=="string"){t[0].match(/[a-zA-Z]/)?this.e=document.createElement(t):this.e=document.querySelector(t);let n=this.e;e&&this.attrParser(e).map(a=>{n.setAttribute(a[0],a[1])}),s&&this.setInner(s),r&&(n.style=r),this.e=n}else if(t instanceof Node)if(t.nodeType===1){this.e=t;let n=t.childNodes;for(let a=0;a<n.length;a++){let l=new this.Child_Constructor(n[a]);l&&(l.parent=this,this.children.push(l))}}else if(t.nodeType===3)this.e=t,this.nodeType=3;else return!1;else throw new Error("Unexpected input type "+t)}setInner(t){this.children.clear(),this.e.innerHTML=t;let e=this.e.childNodes;for(let s=0;s<e.length;s++){let r=new this.Child_Constructor(e[s]);r&&(r.parent=this,this.children.push(r))}return this}push_back(){let t=this.getELEM.apply(this,[...arguments]);return t.remove(),t.parent=this,this.children.push(t),this.e.appendChild(t.e),t}pop_back(){let t=this.children.getTail();return t.remove(),t}push_front(){let t=this.getELEM.apply(this,[...arguments]);return t.remove(),t.parent=this,this.children.push_front(t),this.e.children.length===0?this.e.appendChild(t.e):this.e.insertBefore(t.e,this.e.children[0]),t}pop_front(){let t=this.children.getHead();return t.remove(),t}attr(t,e){return this.e.setAttribute(t,e),this}style(t){let e=this.e;return this.attrParser(t).map(([s,r])=>{e.style[s]=r}),this}remove(){return this.parent?this.parent.removeChild(this):this.e.parentNode&&(console.log("Warning: removing an element through raw dom"),this.e.parentNode.removeChild(this.e)),this}removeChild(t){return this.children.delete(t),this.e.removeChild(t.e),t.parent=null,this}insertBefore(t,e){if(e instanceof C)return t.remove(),this.e.insertBefore(t.e,e.e),this.children.insertBefore(t,e),t.parent=this,t;{let s=this.parent;if(!s)throw new Error("parent to the node not defined");return t=this.getELEM.apply(this,[...arguments]),s.insertBefore(t,this),t}}insertAfter(t,e){if(e instanceof C){let s=this.children.getNext(t);return s===null?this.push(e):this.insertBefore(e,s)}else{let s=this.parent;if(!s)throw new Error("parent to the node not defined");return t=this.getELEM.apply(this,[...arguments]),s.insertAfter(this,t)}}replaceChild(t,e){return this.insertAfter(t,e),t.remove(),e}replaceInPlace(t){this.parent?this.parent.replaceChild(this,t):(t.remove(),this.parent.removeElement(this.e),this.parent.appendChild(t.e))}on(t,e){return this.e.addEventListener(t,e),e}off(t,e){return this.e.removeEventListener(t,e),e}style(t){let e=this.attrParser(t),s=this.e;return e.map(([r,n])=>{s.style[r]=n}),this}once(t){let e=this,s=[];for(let r=1;r<arguments.length;r++){let n=arguments[r],a=(function(l,d){for(let i=0;i<s.length;i++)e.e.removeEventListener(t,s[i]);s=[],l(d)}).bind(null,n);s.push(a),this.e.addEventListener(t,a)}return{remove:function(){for(let r=0;r<s.length;r++)e.e.removeEventListener(t,s[r])}}}getX(){return this.e.offsetLeft}getY(){return this.e.offsetTop}getWidth(){return this.e.offsetWidth}getHeight(){return this.e.offsetHeight}getNext(){if(!this.parent)throw new Error("unsupported operation: parent not registered");return this.parent.children.getNext(this)}getPrev(){if(!this.parent)throw new Error("unsupported operation: parent not registered");return this.parent.children.getPrev(this)}getDescendent(t){let e=[];for(;t!==this.e;)e.push(t),t=t.parentNode;let s=this;for(;e.length!==0;){let r=e.pop();s=s.children.getInstance(r)}return s}query(t){return this.getDescendent(this.e.querySelector(t))}queryAll(t){let e=this;return[...this.e.querySelectorAll(t)].map(s=>e.getDescendent(s))}get rect(){return this.e.getBoundingClientRect()}get prev(){return this.getPrev()}get next(){return this.getNext()}get head(){return this.children.getHead()}get tail(){return this.children.getTail()}};w(C,"attrParser",N);let x=C;x.prototype.add=x.prototype.push_back;x.prototype.push=x.prototype.push_back;x.prototype.pop=x.prototype.pop_back;const A={css:"",add:function(o){this.css+=o},init:function(){let o=new x(document.head),t=new Blob([this.css],{type:"text/css"});o.add(new x("link","rel:stylesheet")).attr("href",URL.createObjectURL(t))}};console.log("common called");A.add(`
body{
    background: linear-gradient(174deg, rgb(168 202 213) 0%, rgb(254 248 224) 100%);
    padding: 0px;
    font-family: Arial;
    color: #eee;
    font-size: 1.2em;
    margin: 0px;
    min-height: 100vh;
}

.stdbox{
    padding:1em;
    margin: 1em;
    box-shadow:0px 0px 3px #000;
    background-color:#333;
}
`);const D="/404.png";A.add(`
#e404{
    max-width: 900px;
    margin: 0 auto;
}

#e404 .container{
    position:relative;
}

#e404 h1{
    color: #222;
    position: absolute;
    top: 1em;
    width: 100%;
    text-align: center;
    font-size: 2.5em;
}

#e404 img{
    width:100%;
}
`);class O extends x{constructor(){super("div","id:e404"),this.add("div","class:stdbox","The resource you were looking for were not found");let t=this.add("div","class:stdbox container");t.add("h1",0,"404 Not Found"),t.add("img").attr("src",D)}}class U{constructor(t){this.order=t,this.length=1<<t;const e=new Int32Array(this.length);e[0]=0,e[1]=1;for(let s=1;s<t;s++){let r=1<<s;for(let n=r-1;n>=0;n--)e[n*2]=e[n],e[n*2+1]=e[n]+r}this.nummap=e}baseTransform(t){const e=new Float64Array(t.buffer),{nummap:s,order:r}=this,n=this.length,a=new Float32Array(n*2),l=new Float64Array(a.buffer);for(let d=0;d<n;d++){let i=s[d];l[d]=e[i]}for(let d=1;d<=r;d++){const i=1<<d,c=i>>>1;for(let h=0;h<n;h+=i)for(let p=0;p<c;p++){let u=(h+p)*2,f=(h+p+c)*2;const g=Math.cos(p/i*Math.PI*2),y=Math.sin(p/i*Math.PI*2),M=a[u+0],k=a[u+1],_=a[f+0],F=a[f+1],T=_*g-F*y,P=_*y+F*g;a[u+0]=M+T,a[u+1]=k+P,a[f+0]=M-T,a[f+1]=k-P}}return a}fft(t){const e=this.baseTransform(t),s=this.length;for(let r=1;r<s*2;r+=2)e[r]=-e[r];return e}ifft(t){const e=this.baseTransform(t),s=this.length;for(let r=0;r<s*2;r++)e[r]=e[r]/s;return e}static toComplex(t){const e=new Float32Array(t.length*2);for(let s=0;s<t.length;s++)e[s*2]=t[s];return e}}const L=new Map,q=function(o){const t=Math.round(Math.log(o)/Math.log(2));let e;return(e=L.get(t))||(e=new U(t),L.set(t,e)),e},$=function(o){return q(o.length/2).fft(o)},R=function(o){return q(o.length/2).ifft(o)},z=function(o,t,e){const s=t*2,r=e*2,n=[];for(let l=0;l<e;l++)n.push($(o.slice(l*s,(l+1)*s)));let a=new Float32Array(t*e*2);for(let l=0;l<t;l++){let d=new Float32Array(r);for(let i=0;i<e;i++)d[i*2+0]=n[i][l*2+0],d[i*2+1]=-n[i][l*2+1];d=$(d);for(let i=0;i<e;i++)a[i*s+l*2+0]=d[i*2+0],a[i*s+l*2+1]=d[i*2+1]}return a},K=function(o,t,e){const s=t*2,r=e*2,n=[];for(let l=0;l<e;l++)n.push(R(o.slice(l*s,(l+1)*s)));let a=new Float32Array(t*e*2);for(let l=0;l<t;l++){let d=new Float32Array(r);for(let i=0;i<e;i++)d[i*2+0]=n[i][l*2+0],d[i*2+1]=n[i][l*2+1];d=R(d);for(let i=0;i<e;i++)a[i*s+l*2+0]=d[i*2+0],a[i*s+l*2+1]=d[i*2+1]}return a},I=function(o,t,e,s){let r=z(o,e,s),n=z(t,e,s);for(let l=0;l<r.length;l+=2){const d=r[l],i=n[l],c=r[l+1],h=n[l+1];r[l]=d*i-c*h,r[l+1]=d*h+i*c}return K(r,e,s)},m=512/2,v=512/2;A.add(`
.sim{
    display: grid;
    justify-content: center;
    align-content: center; 
    grid-template-columns: ${Math.max(512,m)}px 15em;
    grid-template-rows: ${Math.max(512,v)}px;
    column-gap: 1em;
    row-gap: 1em;
    padding: 1em;
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
}

.sim>div{
    margin: 0px;
    box-sizing: border-box;
}

.main{
    grid-area: 1/1/2/2;
}

.right{
    grid-area: 1/2/2/3;
}
`);const Z=function(o){o>1&&(o=1),o<0&&(o=0);const t=o*256,e=Math.cos((o-.5)*4)*255,s=(1-o)*256;return[t,e,s,255]},J=function(o,t=.01){return t=2e-32,o===1/0?1:-2/(1+Math.E**(2*Math.log(t*o+1)))+1};let Q=class extends x{constructor(){super("canvas");w(this,"G",66743015e-18);w(this,"pw",15e10);const e=this.canvas=this.e;e.width=m,e.height=v;const s=e.getContext("2d");s.font="60px Arial",s.textAlign="center",s.fillText("Fuck You",m/2,v*.7);const r=[],n=s.getImageData(0,0,m,v),a=n.data;for(let c=0;c<m;c++)for(let h=0;h<m;h++){const p=(c*m+h)*4;if(a[p+3]>100)for(let f=0;f<1;f+=.2)for(let g=0;g<1;g+=.2)r.push([1989e27,h+f,c+g,0,0])}console.log(r.length),this.objects=r,this.imgdata=n,this.ctx=s;const l=m*v,d=Math.floor(m/2),i=Math.floor(v/2);this.densityMask=new Float32Array(l*2),this.kernelX=new Float32Array(l*2),this.kernelY=new Float32Array(l*2);for(let c=0;c<m;c++)for(let h=0;h<m;h++){const p=c*m+h;let u=(h+d)%m,f=(c+i)%v,g=d-u,y=i-f;if(g===0&&y===0){this.kernelX[p*2]=0,this.kernelY[p*2]=0;continue}g*=this.pw,y*=this.pw;const M=g*g+y*y,k=Math.sqrt(M),_=1/M,F=_*(g/k),T=_*(y/k);this.kernelX[p*2]=F*this.G,this.kernelY[p*2]=T*this.G}this.start()}step(e){console.log("stepping");const s=this.densityMask,r=this.objects,{ctx:n,imgdata:a}=this,{data:l}=a;s.fill(0);for(let c of r){let h=c[0],p=Math.floor(c[1]);const f=Math.floor(c[2])*m+p;s[f*2]+=h}for(let c=0;c<m;c++)for(let h=0;h<m;h++){let p=c*m+h;const[u,f,g,y]=Z(J(s[p*2],1));l[p*4+0]=u,l[p*4+1]=f,l[p*4+2]=g,l[p*4+3]=y}n.putImageData(a,0,0);const d=I(s,this.kernelX,m,v),i=I(s,this.kernelY,m,v);for(let c of r){const h=Math.floor(c[1]),u=Math.floor(c[2])*m+h;c[3]+=d[u*2]*e,c[4]+=i[u*2]*e,c[1]+=c[3]*e,c[2]+=c[4]*e}}async start(){for(;;)this.step(.8),await new Promise(e=>setTimeout(e,0))}};A.add(`
.sim canvas{
    margin-left: ${(512-m)/2}px;
    margin-top: ${(512-v)/2}px;
}
`);class V extends x{constructor(){super("div","class: sim");const t=this.add("div","class: stdbox main",0,"padding:0px;"),e=this.add("div","class: stdbox right"),s=t.add(new Q);e.add("div",0,`Number of particles: ${s.objects.length}`)}}class tt{constructor(t,e,s,r){w(this,"G",66743015e-18);this.pw=e;const n=s*r,a=Math.floor(s/2),l=Math.floor(r/2);this.densityMask=new Float32Array(n*2),this.kernelX=new Float32Array(n*2),this.kernelY=new Float32Array(n*2),this.objects=t,this.width=s,this.height=r;for(let d=0;d<s;d++)for(let i=0;i<s;i++){const c=d*s+i;let h=(i+a)%s,p=(d+l)%r,u=a-h,f=l-p;if(u===0&&f===0){this.kernelX[c*2]=0,this.kernelY[c*2]=0;continue}u*=this.pw,f*=this.pw;const g=u*u+f*f,y=Math.sqrt(g),M=1/g,k=M*(u/y),_=M*(f/y);this.kernelX[c*2]=k*this.G,this.kernelY[c*2]=_*this.G}}step(t){const e=this.densityMask,s=this.objects;e.fill(0);const{width:r,height:n,pw:a}=this;for(let h of s){let p=h[0],u=Math.floor(h[1]/a);const g=Math.floor(h[2]/a)*r+u;e[g*2]+=p}const l=I(e,this.kernelX,r,n),d=I(e,this.kernelY,r,n),i=r*a,c=n*a;for(let h of s){const p=Math.floor(h[1]/a),f=Math.floor(h[2]/a)*r+p;h[3]+=l[f*2]*t,h[4]+=d[f*2]*t,h[1]=(h[1]+h[3]*t+i)%i,h[2]=(h[2]+h[4]*t+c)%c}return s}}let Y;const et=function(o){Y=o},st=function(o){Y.route(o)},b=512,j=512,S=256,rt=256;A.add(`
.sim{
    display: grid;
    justify-content: center;
    align-content: center; 
    grid-template-columns: ${b}px 15em;
    grid-template-rows: 1fr 4em;
    column-gap: 1em;
    row-gap: 1em;
    padding: 1em;
    box-sizing: border-box;
    height: calc(${j}px + 2em);
    width: 100vw;
}

.sim>div{
    margin: 0px;
    box-sizing: border-box;
}

.main{
    grid-area: 1/1/3/2;
}

.right{
    grid-area: 1/2/2/3;
}

.bottom{
    grid-area: 2/2/3/3;
    background-color: #00ab4d;
}
.bottom:hover{
    background-color: #00d15e;
}
`);const nt=function(o){o>1&&(o=1),o<0&&(o=0);const t=o*256,e=Math.cos((o-.5)*4)*255,s=(1-o)*256;return[t,e,s,255]},ot=function(o,t=.01){return t=2e-32,o===1/0?1:-2/(1+Math.E**(2*Math.log(t*o+1)))+1};class it extends x{constructor(){super("canvas");w(this,"stopped",!1);w(this,"onFrame",()=>{});const e=15e10,s=this.pw=e*S/b,r=this.canvas=this.e;r.width=b,r.height=j;const n=this.ctx=r.getContext("2d");n.font="70px Arial",n.textAlign="center",n.fillText("What?",b/2,j*.3),n.fillText("The",b/2,j*.5),n.fillText("Fuck",b/2,j*.7);const a=this.objects=[],l=this.imgdata=n.getImageData(0,0,b,j),d=this.data=l.data;for(let i=0;i<b;i++)for(let c=0;c<b;c++){const h=(i*b+c)*4;if(d[h+3]>100)for(let u=0;u<1;u+=.2)for(let f=0;f<1;f+=.2){const g=(c+u)*s,y=(i+f)*s;a.push([1989e27,g,y,0,0])}}this.density=new Float32Array(b*j),this.simulation=new tt(a,e,S,rt)}step(e){const s=this.simulation.objects,{ctx:r,imgdata:n,pw:a,density:l}=this,{data:d}=n;l.fill(0);for(let i of s){let c=i[0],h=Math.floor(i[1]/a);const u=Math.floor(i[2]/a)*b+h;l[u]+=c}for(let i=0;i<j;i++)for(let c=0;c<b;c++){let h=i*b+c;const[p,u,f,g]=nt(ot(l[h],1));d[h*4+0]=p,d[h*4+1]=u,d[h*4+2]=f,d[h*4+3]=g}r.putImageData(n,0,0),this.simulation.step(e)}async start(){let e=0;const s=6e4;for(;!this.stopped;)this.step(s),this.onFrame(e,s),e+=s,await new Promise(r=>setTimeout(r,0))}async stop(){this.stopped=!0}}A.add(`
.sim canvas{
    margin-left: ${(512-b)/2}px;
    margin-top: ${(512-j)/2}px;
}
`);class lt extends x{constructor(){super("div","class: sim");const t=this.add("div","class: stdbox main",0,"padding:0px;"),e=this.add("div","class: stdbox right"),s=t.add(new it);e.add("div",0,`Number of particles: ${s.objects.length}`);const r=e.add("div",0),n=e.add("div",0),a=e.add("div",0),l=e.add("div",0);s.onFrame=function(i,c){r.setInner(`Time elapsed (s): ${i}`);const h=Math.floor(i/60/60),p=Math.floor(h/24),u=Math.floor(p/365);n.setInner(`${h%24} hours`),a.setInner(`${p%365} days`),l.setInner(`${u} years`)},this.add("div","class: stdbox bottom","Impressed? You can also simulate your mom →").on("click",()=>{st("fasdlj"),s.stop()}),s.start()}}class at{constructor(t){this.container=t,this.pages={page404:O,sim:V,"gravity-sim":lt},this.route("gravity-sim")}route(t,...e){t in this.pages||(t="page404"),this.setPage(this.pages[t],e)}setPage(t,e){var s,r;(r=(s=this.current)==null?void 0:s.remove)==null||r.call(s),this.current=new t(e),console.log(this.container,this.current.e),this.container.appendChild(this.current.e)}}A.init();const ht=new at(document.body);et(ht);
