const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,mob=innerWidth<720||matchMedia('(pointer:coarse)').matches,fine=matchMedia('(pointer:fine)').matches&&!RM;
const de=document.documentElement;let mx=0,my=0;
/* load sequence */
let started=false;const go=()=>{if(!started){started=true;de.classList.add('go')}};
addEventListener('load',()=>setTimeout(go,RM?0:500));setTimeout(go,2500);
/* nav */
const nav=document.getElementById('nav'),mb=document.getElementById('mb');
mb.onclick=()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
document.querySelectorAll('.pill a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded',false)}));
addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');mb.setAttribute('aria-expanded',false)}});
const links=[...document.querySelectorAll('.pill a')];
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('section[id]').forEach(s=>so.observe(s));
/* reveal */
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(e=>ro.observe(e));
/* timeline progress */
const tls=[...document.querySelectorAll('[data-tl]')];let tk=0;
function tlp(){tk=0;tls.forEach(t=>{const b=t.getBoundingClientRect(),p=RM?1:Math.min(1,Math.max(0,(innerHeight*.65-b.top)/b.height));t.style.setProperty('--p',p)})}
addEventListener('scroll',()=>{if(!tk)tk=requestAnimationFrame(tlp)},{passive:true});tlp();
/* count-up numbers */
if(!RM){const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,n=+el.dataset.n,d=+el.dataset.d,p=el.dataset.p||'',t0=performance.now();
const step=t=>{const k=Math.min(1,(t-t0)/1100),v=n*(1-Math.pow(1-k,3));el.textContent=p+v.toFixed(d);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.6});
document.querySelectorAll('[data-n]').forEach(e=>co.observe(e))}
/* project details */
document.querySelectorAll('.tg').forEach(b=>b.addEventListener('click',()=>{const c=b.closest('.proj'),o=c.classList.toggle('op');b.setAttribute('aria-expanded',o);b.textContent=o?'Hide details':'Show details'}));
/* pointer effects */
const fr=document.querySelector('.fr');
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;if(fine&&fr){fr.style.setProperty('--ry',mx*6+'deg');fr.style.setProperty('--rx',-my*5+'deg')}},{passive:true});
if(fine){
document.querySelectorAll('[data-tilt]').forEach(e=>{
e.addEventListener('pointermove',v=>{const b=e.getBoundingClientRect(),x=(v.clientX-b.left)/b.width,y=(v.clientY-b.top)/b.height;e.style.setProperty('--ry',((x-.5)*8).toFixed(2)+'deg');e.style.setProperty('--rx',((.5-y)*8).toFixed(2)+'deg');e.style.setProperty('--mx',x*100+'%');e.style.setProperty('--my',y*100+'%')});
e.addEventListener('pointerleave',()=>{e.style.setProperty('--rx','0deg');e.style.setProperty('--ry','0deg')})});
document.querySelectorAll('.mag').forEach(e=>{
e.addEventListener('pointermove',v=>{const b=e.getBoundingClientRect();e.style.translate=((v.clientX-b.left-b.width/2)*.22)+'px '+((v.clientY-b.top-b.height/2)*.32)+'px'});
e.addEventListener('pointerleave',()=>{e.style.translate='0 0'})})}
/* contact form (Formspree) */
const cf=document.getElementById('cf'),st=document.getElementById('st');
cf.addEventListener('submit',async e=>{
e.preventDefault();
const say=(m,c)=>{st.textContent=m;st.className=c||''};
if(cf.action.includes('YOUR_FORM_ID')){say('Form not connected yet: replace YOUR_FORM_ID in index.html with your Formspree form ID.','err');return}
const btn=cf.querySelector('button');btn.disabled=true;say('Sending...');
try{
const r=await fetch(cf.action,{method:'POST',body:new FormData(cf),headers:{Accept:'application/json'}});
if(r.ok){cf.reset();say('Thanks! Your message has been sent.','ok')}
else{const d=await r.json().catch(()=>({}));say(d.errors?d.errors.map(x=>x.message).join(', '):'Something went wrong. Please email me directly instead.','err')}
}catch(err){say('Network error. Please try again or email me directly.','err')}
btn.disabled=false});
/* 3D scene, loaded lazily */
function initGL(){
const cv=document.getElementById('gl');let r;
try{r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:!mob,powerPreference:'low-power'})}catch(e){return}
r.setPixelRatio(Math.min(devicePixelRatio,mob?1.25:1.75));
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100),rig=new THREE.Group();sc.add(rig);
const N=mob?420:1300,p=new Float32Array(N*3);
for(let i=0;i<N;i++){p[i*3]=(Math.random()-.5)*28;p[i*3+1]=(Math.random()-.5)*46;p[i*3+2]=(Math.random()-.5)*16-2}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
const pts=new THREE.Points(g,new THREE.PointsMaterial({size:.045,color:0xa5bcff,transparent:true,opacity:.65,depthWrite:false}));
const wire=(geo,c,o)=>new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:c,wireframe:true,transparent:true,opacity:o,depthWrite:false}));
const ico=wire(new THREE.IcosahedronGeometry(2.3,1),0x8fa8ff,.17),oct=wire(new THREE.OctahedronGeometry(1.5,0),0xd6b8ff,.2);
const ring=new THREE.Mesh(new THREE.TorusGeometry(3.5,.01,6,140),new THREE.MeshBasicMaterial({color:0xd6b8ff,transparent:true,opacity:.35}));
rig.add(pts,ico,oct,ring);
function size(){const w=innerWidth<900;r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ico.position.set(w?0:3.6,w?3.2:.2,-2);ring.position.copy(ico.position);oct.position.set(w?2:-5,-9,-2)}
addEventListener('resize',()=>{size();if(RM)draw(0)});size();
let cx=0,cy=0,sy=0,raf=0;const t0=performance.now();
function draw(now){
const t=(now-t0)/1000,s=scrollY/Math.max(1,de.scrollHeight-innerHeight);
if(RM){sy=s}else{cx+=(mx*.7-cx)*.05;cy+=(-my*.45-cy)*.05;sy+=(s-sy)*.06}
rig.position.y=sy*16;cam.position.set(cx,cy,9);cam.lookAt(0,0,0);
ico.rotation.set(t*.08+cy*.3,t*.12+cx*.3,0);oct.rotation.set(t*.15,t*.1,0);ring.rotation.set(1.2+cy*.2,t*.06,cx*.2);pts.rotation.y=t*.012;
r.render(sc,cam)}
function loop(n){raf=requestAnimationFrame(loop);draw(n)}
if(RM){draw(t0);addEventListener('scroll',()=>draw(t0),{passive:true})}
else{loop(t0);document.addEventListener('visibilitychange',()=>{document.hidden?cancelAnimationFrame(raf):loop(performance.now())})}}
const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=initGL;document.head.appendChild(s);
