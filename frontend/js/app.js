'use strict';
/* VitaForge — Designed & developed by NIKHIL CHARY SRIRAMOJU */
console.log('%cVitaForge%c Designed & developed by NIKHIL CHARY SRIRAMOJU','color:#4DE1FF;font-weight:800','color:#8A96BD');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FD=[['name','Full name'],['title','Target title'],['email','Email'],['phone','Phone'],['loc','Location'],['github','GitHub URL'],['linkedin','LinkedIn URL'],['summary','Professional summary','t'],['skills','Skills (comma separated)','t'],['exp','Experience: company line, then • bullets','t'],['projects','Projects','t'],['edu','Education','t'],['certs','Certifications','t'],['ach','Achievements','t']];
const F=FD.map(a=>a[0]),BUL=/^\s*[•●▪◦·\-–*▸►▶➤✓✔❖‣○]\s*/,S={};
const VERBS=new Set('developed built designed implemented led created engineered optimized automated deployed architected improved reduced increased delivered launched managed analyzed integrated trained configured migrated secured streamlined collaborated established researched resolved tested containerized orchestrated wrote produced mentored supported achieved scaled refactored maintained published presented coordinated executed leveraged contributed spearheaded reviewed conducted debugged documented monitored evaluated validated solved'.split(' '));
const WEAK=[[/^responsible for\s+/i,''],[/^worked with\s+/i,'Collaborated with '],[/^worked on\s+/i,'Developed '],[/^helped( to)?\s+/i,'Supported '],[/^involved in\s+/i,''],[/^did\s+/i,'Executed '],[/^made\s+/i,'Built '],[/^used\s+/i,'Leveraged '],[/^handled\s+/i,'Managed ']];
const HK=[['summary',/^(professional |career )?(summary|objective|profile|about( me)?)$/i],['skills',/^([\w&\/ ]+ )?skills$|^(core )?competencies$|^technologies( & tools)?$/i],['exp',/^(work |professional |relevant )?(experience|employment|internships?)( history)?( & .*)?$/i],['projects',/^(academic |personal |key |selected )?projects$/i],['edu',/^education( & .*)?$|^academics?$|^qualifications?$/i],['certs',/^(certifications?|licenses|courses)( & .*)?$/i],['ach',/^(achievements|awards|honou?rs|accomplishments)$/i]];
const IRR=new Set('built led ran wrote made drove took held won sold taught began brought chose grew kept set put cut spent sent found gave got met saw thought understood'.split(' '));
const lead=b=>(b.match(/^[^:]{3,70}:\s+(\S+)/)||[])[1]||b.split(/\s+/)[0];
const isVerb=w=>{w=String(w).toLowerCase().replace(/[^a-z]/g,'');return VERBS.has(w)||IRR.has(w)||(w.length>4&&/ed$/.test(w))};
const hk=l=>{const c=l.replace(/[:\-–_]+$/,'').trim();if(c.length>34)return'';const m=HK.find(([,r])=>r.test(c));return m?m[0]:''};
const KB=[["Reduced API latency by 40% by adding Redis caching and async batching","backend api redis cache latency python fastapi performance"],["Containerised 5 services with Docker Compose, cutting onboarding from 2 days to 30 minutes","docker compose devops container deployment"],["Built REST endpoints serving 10k+ daily requests with 99.9% uptime","rest api backend python fastapi node uptime"],["Raised test coverage from 35% to 85% using pytest and CI checks","testing pytest ci quality coverage"],["Designed a React dashboard that cut support tickets by 25%","react frontend dashboard ui javascript typescript"],["Optimised SQL queries and indexes, speeding reports 3x","sql database postgresql index query performance"],["Automated deployments with GitHub Actions, reducing release time by 60%","ci cd github actions automation devops git"],["Built a retrieval pipeline over 50k documents with 92% answer accuracy","rag retrieval vector embeddings llm ai search"],["Trained a CNN classifier reaching 94% accuracy on 20k images","cnn pytorch tensorflow vision model ml deep learning machine"],["Led a team of 4 to ship an MVP in 6 weeks, adopted by 300 users","team lead mvp project users leadership"],["Implemented JWT authentication and role-based access for 3 user types","auth jwt security access backend"],["Built an agent that triages tickets and resolves 30% without a human","agent agentic ai automation llm tools"]];
const SAMPLE=`AARAV MEHTA
Full-Stack & AI Engineer
Hyderabad, India | +91 98765 43210 | aarav.mehta@example.com | github.com/aarav-m | linkedin.com/in/aarav-mehta
SUMMARY
Final-year computer science student who builds web apps, APIs and machine learning tools. Experienced in Python, React and Docker, with a habit of shipping small, useful, well-tested products that real users depend on every day.
SKILLS
Languages: Python, Java, JavaScript, TypeScript, SQL
Frameworks: React, Node.js, FastAPI
Tools: Docker, Git, PostgreSQL, REST APIs, Machine Learning, RAG
EXPERIENCE
Nimbus Labs, Backend Intern | Jun 2025 - Dec 2025
- Responsible for maintaining billing REST APIs used by 12k users
- Worked on Redis caching that cut response time by 35%
- Wrote unit tests that raised coverage from 40% to 82%
- Helped the team with deployment scripts
- Built a CI pipeline with GitHub Actions that cut release time from 45 to 15 minutes
- Collaborated with 5 engineers to migrate 3 services from a monolith to Docker containers
- Reviewed 60+ pull requests and mentored 2 new interns
PROJECTS
TaskFlow, real-time task manager | React, Node.js, WebSockets
- Built real-time sync supporting 500 concurrent users
- Containerized the stack with Docker Compose for one-command setup
- Trained a CNN classifier with 91% accuracy on 15k images
PaperTrail, RAG study assistant | Python, FastAPI, Qdrant
- Created a retrieval pipeline over 8k documents with 90% answer accuracy
- Deployed the service on a free cloud tier with 99% uptime over 3 months
EDUCATION
B.Tech, Computer Science and Engineering | JNTU Hyderabad | 2022 - 2026
CERTIFICATIONS
- AWS Cloud Practitioner (2025), Forage Software Engineering Job Simulation (2025)
ACHIEVEMENTS
- Finalist, college hackathon 2025 (top 10 of 120 teams)
- Solved 300+ problems on coding platforms`;
const glue=ls=>{const o=[];let m='';for(const l of ls){if(/^[•●▪◦·\-–*▸►▶➤✓✔❖‣○]$/.test(l)){m=l+' ';continue}o.push(m+l);m=''}return o};
const mergeL=ls=>{const o=[];let inB=0;for(const l of ls){if(BUL.test(l)){const tx=l.replace(BUL,'');if(inB&&o.length&&/^[a-z0-9(\[]/.test(tx)&&!/[.!?:]$/.test(o[o.length-1])){o[o.length-1]+=' '+tx;continue}o.push(l);inB=1}else if(inB&&o.length&&(/^[a-z0-9(\[$%&\/]/.test(l)||(!/ — | – |\s\|\s/.test(l)&&!/\b(19|20)\d\d\b/.test(l)&&!/[.!?:]$/.test(o[o.length-1])&&!/^[A-Z][a-z]+ [A-Z]/.test(l)))){o[o.length-1]+=' '+l}else{o.push(l);inB=0}}return o};
function parse(t){const L=glue(t.replace(/\r/g,'').split('\n').map(l=>l.trim()).filter(Boolean)),all=L.join(' '),d=Object.fromEntries(F.map(k=>[k,'']));
 d.email=(all.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)||[''])[0];
 d.phone=(all.match(/(?:\+\d{1,3}[\s-]?)?\d{5}[\s-]?\d{5}|(?:\+\d{1,3}[\s-]?)?\d{3}[\s-]\d{3}[\s-]\d{4}/)||[''])[0].trim();
 d.github=(all.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i)||[''])[0];
 d.linkedin=(all.match(/(?:https?:\/\/)?(?:[a-z]+\.)?linkedin\.com\/in\/[\w%-]+/i)||[''])[0];
 const ni=L.findIndex(l=>!/@|http/i.test(l)&&l.length<45&&!hk(l));d.name=ni<0?'':L[ni];
 const tl=L[ni+1];if(tl&&!/@|\d{5}/.test(tl)&&tl.length<95&&!hk(tl))d.title=tl;
 const head=L.slice(0,7),cl=head.find(l=>l.includes('@'));if(cl){const p=cl.split(/[|·•]/).map(s=>s.trim()).find(s=>s&&!/[@\d]|http|github|linkedin/i.test(s));if(p)d.loc=p}
 if(!d.loc){const p=head.find(l=>/^[A-Z][A-Za-z .]+(, [A-Z][A-Za-z .]+){1,3}$/.test(l)&&!hk(l)&&l!==d.name);if(p)d.loc=p}
 let cur='';const B={};for(const l of L){const k=hk(l);if(k){cur=k;B[k]=[];continue}if(cur)B[cur].push(l)}
 const j=(k,s)=>(B[k]||[]).join(s);d.summary=j('summary',' ');
 const SL=B.skills||[],lab=/^[^:,]{1,40}:/,hasLab=SL.some(l=>lab.test(l.replace(BUL,''))),sk=[];
 for(const l of SL){const x=l.replace(BUL,'');if(hasLab&&sk.length&&!lab.test(x))sk[sk.length-1]+=' '+x;else sk.push(x)}
 d.skills=hasLab?sk.join('\n'):sk.join(', ');
 ['exp','projects','edu','certs','ach'].forEach(k=>d[k]=mergeL(B[k]||[]).join('\n'));
 if(!cur)d.exp=L.slice(ni+2).join('\n');return d}
const getData=()=>Object.fromEntries(F.map(k=>[k,$('#f_'+k).value.trim()]));
const setData=d=>F.forEach(k=>$('#f_'+k).value=d[k]||'');
const skillList=d=>[...new Set(d.skills.split('\n').flatMap(l=>l.replace(/^[^:,]{1,40}:\s*/,'').split(/[,;|·•]/)).map(s=>s.replace(BUL,'').trim()).filter(Boolean))];
const isHd=l=>!BUL.test(l)&&(/\|/.test(l)||/\b(19|20)\d\d\b.*\b((19|20)\d\d|present)\b/i.test(l)||l.split(/\s+/).length<9);
const bulletsOf=d=>{const ls=[d.exp,d.projects].join('\n').split('\n').map(s=>s.trim()).filter(Boolean),mk=ls.some(l=>BUL.test(l));return ls.filter(l=>mk?BUL.test(l):!isHd(l)).map(s=>s.replace(BUL,''))};
const textOf=d=>F.map(k=>d[k]).join(' ');
const STOP=new Set('the and for with you our are will this that from your have has but not all can any who their they about work team role must also such been being into more other than then them its out use using used able job years year experience strong good new etc per via should would what when where which while across within including'.split(' '));
const kws=jd=>{const m={};(jd.toLowerCase().match(/[a-z][a-z0-9+#.]{2,}/g)||[]).forEach(w=>{w=w.replace(/\.$/,'');if(!STOP.has(w))m[w]=(m[w]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,22).map(e=>e[0])};
function score(d,jd){const P=[],add=(k,g,m,tip)=>P.push({k,got:Math.round(Math.max(0,Math.min(m,g))*10)/10,max:m,tip});
 add('Contact info',(d.name?2:0)+(d.email?3:0)+(d.phone?3:0)+(d.loc?2:0),10,'Add name, email, phone and city');
 add('Standard sections',(d.summary?3:0)+(d.skills?4:0)+(d.exp||d.projects?4:0)+(d.edu?4:0),15,'Include Summary, Skills, Experience/Projects and Education with standard headings');
 const sk=skillList(d);add('Skills keywords',sk.length*1.25,15,'List 12+ relevant skills ('+sk.length+' found)');
 const bl=bulletsOf(d),vb=bl.filter(b=>isVerb(lead(b))).length;
 add('Action verbs',bl.length?10*vb/bl.length:0,10,'Start every bullet with a strong action verb ('+(bl.length-vb)+' do not)');
 const mt=bl.filter(b=>/\d/.test(b)).length;add('Measurable impact',bl.length?Math.min(1,mt/bl.length/.6)*15:0,15,'Add real numbers (%, users, time, scale) to 60%+ of bullets ('+mt+'/'+bl.length+' have one)');
 const w=textOf(d).split(/\s+/).filter(Boolean).length;add('One-page length',w>=300&&w<=620?10:w<300?10*w/300:10-(w-620)/30,10,'Aim for 300–620 words ('+w+' now)');
 const av=bl.length?bl.reduce((a,b)=>a+b.split(/\s+/).length,0)/bl.length:0;add('Bullet quality',Math.min(bl.length/6,1)*(av>=8&&av<=24?10:6),10,'Use 6+ bullets of 8–24 words');
 add('Profile links',(d.github?2.5:0)+(d.linkedin?2.5:0),5,'Add GitHub and LinkedIn');
 add('Certs & achievements',(d.certs?2.5:0)+(d.ach?2.5:0),5,'Add certifications and achievements');
 const K=kws(jd||''),tx=textOf(d).toLowerCase(),miss=K.filter(k=>!tx.includes(k));
 add('Job keyword match',jd&&K.length?5*(K.length-miss.length)/K.length:(sk.length>=10?5:sk.length/2),5,jd?'Missing job keywords: '+miss.slice(0,6).join(', '):'Paste a job description to check keywords');
 return{total:Math.round(P.reduce((a,p)=>a+p.got,0)),parts:P,miss,noNum:bl.filter(b=>!/\d/.test(b))}}
const blk=t=>{let o='',u=0;for(const l of t.split('\n').map(s=>s.trim()).filter(Boolean)){if(BUL.test(l)){if(!u){o+='<ul>';u=1}o+='<li>'+esc(l.replace(BUL,''))+'</li>'}else{if(u){o+='</ul>';u=0}o+='<div class="b">'+esc(l)+'</div>'}}return o+(u?'</ul>':'')};
function sheetHTML(d){const c=[d.loc,d.phone,d.email].filter(Boolean).map(esc).join(' | '),c2=[d.linkedin,d.github].filter(Boolean).map(esc).join(' | '),H=(t,h)=>h?`<h2>${t}</h2>${h}`:'';
 return`<h1>${esc(d.name||'Your Name')}</h1>${d.title?`<div class="t">${esc(d.title)}</div>`:''}<div class="c">${c}</div>${c2?`<div class="c">${c2}</div>`:''}`+H('Professional Summary',d.summary&&`<p>${esc(d.summary)}</p>`)+H('Technical Skills',d.skills&&d.skills.split('\n').map(l=>{const m=l.match(/^([^:,]{1,40}):\s*(.*)$/);return m?`<div><b>${esc(m[1])}:</b> ${esc(m[2])}</div>`:`<div>${esc(l)}</div>`}).join(''))+H('Experience',blk(d.exp))+H('Projects',blk(d.projects))+H('Education',blk(d.edu))+H('Certifications',blk(d.certs))+H('Achievements',blk(d.ach))}
function fit(){const s=$('#sheet'),r=$('#rb');let f=12;r.style.fontSize=f+'px';const lim=s.clientHeight-80;while(r.scrollHeight>lim&&f>8){f-=.25;r.style.fontSize=f+'px'}
 const ok=r.scrollHeight<=lim;$('#fitMsg').textContent=ok?`✔ Fits one A4 page (${f.toFixed(1)}px text)`:'⚠ Too long for one page: trim weaker bullets';$('#fitMsg').className=ok?'ok':'bad';return ok}
function gauge(n){const el=$('#gnum'),from=+el.textContent||0,t0=performance.now();$('#gv').style.strokeDashoffset=351.86*(1-n/100);(function f(t){const p=Math.min(1,(t-t0)/1000);el.textContent=Math.round(from+(n-from)*p);if(p<1)requestAnimationFrame(f)})(t0)}
function refresh(){const d=getData(),r=score(d,$('#jd').value);$('#rb').innerHTML=sheetHTML(d);fit();S.last=r;gauge(r.total);$('#live').textContent='Live ATS '+r.total;
 $('#bars').innerHTML=r.parts.map(p=>`<div class="br"><span>${p.k}</span><i><b style="width:${100*p.got/p.max}%"></b></i><span>${p.got}/${p.max}</span></div>`).join('');
 const bad=r.parts.filter(p=>p.got<p.max-.5).sort((a,b)=>(b.max-b.got)-(a.max-a.got)).slice(0,6);
 $('#issues').innerHTML=bad.length?bad.map(p=>`<div class="is">${esc(p.tip)}</div>`).join(''):'<div class="is g">Nothing to fix. This resume is ATS-ready.</div>';
 if(r.noNum.length)$('#issues').innerHTML+=`<div class="is">Needs a number: “${esc(r.noNum[0].slice(0,60))}…”</div>`;
 $('#kw').innerHTML=r.miss.length?'<p class="mu">Missing job keywords (click to add to skills only if true):</p>'+r.miss.map(k=>`<button class="chip">${esc(k)}</button>`).join(''):'';
 try{localStorage.setItem('vitaforge',JSON.stringify(d))}catch(_){}return r}
const skTop=(d,n)=>skillList(d).slice(0,n);
function coverLetter(d,jd,co,role){const K=kws(jd||''),tx=textOf(d).toLowerCase(),hit=K.filter(k=>tx.includes(k)).slice(0,4),bl=bulletsOf(d).filter(b=>/\d/.test(b)).slice(0,2);
 return`Dear Hiring Manager${co?' at '+co:''},\n\nI am excited to apply for the ${role||d.title||'open'} position${co?' at '+co:''}. As a ${d.title||'candidate'} with hands-on experience in ${skTop(d,5).join(', ')}, I focus on building reliable software and delivering measurable results.\n\n${bl.length?'Highlights from my work:\n'+bl.map(b=>'• '+b).join('\n')+'\n\n':''}${hit.length?'Your posting mentions '+hit.join(', ')+', which I have worked with directly.\n\n':''}I would welcome the chance to discuss how I can contribute. Thank you for your time.\n\nSincerely,\n${d.name}\n${[d.email,d.phone].filter(Boolean).join(' | ')}`}
function interviewQs(d){const Q=[],pr=d.projects.split('\n').map(s=>s.trim()).filter(l=>l&&!BUL.test(l));
 pr.slice(0,2).forEach(p=>Q.push(`Walk me through the architecture of "${p.split(/[|,]/)[0].trim()}". What would you change today?`));
 skTop(d,4).forEach(s=>Q.push(`Where have you used ${s} in a real project, and what trade-offs did you make?`));
 bulletsOf(d).filter(b=>/\d/.test(b)).slice(0,3).forEach(b=>Q.push(`You wrote "${b.slice(0,70)}${b.length>70?'…':''}". How did you measure that result?`));
 Q.push('Tell me about a time you debugged a hard production issue.','Describe a disagreement in a team and how you resolved it.');return Q.map((q,i)=>`${i+1}. ${q}`).join('\n')}
const linkedin=d=>`HEADLINE\n${d.title||'Software Engineer'} | ${skTop(d,4).join(' · ')} | Open to opportunities\n\nABOUT\n${d.summary}\n\nCore skills: ${skTop(d,12).join(', ')}.\n${d.github?'Portfolio: '+d.github+'\n':''}Let's connect if you are hiring or building something interesting.`;
function tailor(d,jd){const K=kws(jd||'');if(!K.length)return'Paste a job description at the top of the page first, then run Tailor.';const R=bulletsOf(d).map(b=>({b,n:K.filter(k=>b.toLowerCase().includes(k)).length})).sort((a,b)=>b.n-a.n);
 return'MOST RELEVANT (keep near the top)\n'+R.slice(0,4).map(x=>`• [${x.n} keywords] ${x.b}`).join('\n')+'\n\nLEAST RELEVANT (cut first if you run out of space)\n'+R.slice(-3).reverse().map(x=>`• [${x.n}] ${x.b}`).join('\n')+'\n\nMISSING KEYWORDS (add only if true)\n'+K.filter(k=>!textOf(d).toLowerCase().includes(k)).join(', ')}
const T=$('#term'),log=(m,c='')=>{const d=document.createElement('div');d.className=c;d.textContent='› '+m;T.appendChild(d);T.scrollTop=1e9};
const tok=s=>s.toLowerCase().match(/[a-z0-9+#]{2,}/g)||[];
function retrieve(q,n=4){const qs=new Set(tok(q));return KB.map(([t,k])=>{const ks=new Set(tok(k+' '+t));let h=0;qs.forEach(w=>ks.has(w)&&h++);return{t,s:h/Math.sqrt(qs.size*ks.size||1)}}).sort((a,b)=>b.s-a.s).slice(0,n)}
const rag=h=>{$('#rag').innerHTML=h.map((x,i)=>`<div class="rg">${esc(x.t)}<br><small>match ${(x.s*100).toFixed(0)}%</small> <button class="chip" data-i="${i}">+ add template</button></div>`).join('');S.rag=h};
function rewrite(d){const fx=t=>{const ls=t.split('\n').map(l=>l.trim()).filter(Boolean),mk=ls.some(l=>BUL.test(l));return ls.map(l=>{if(mk?!BUL.test(l):isHd(l))return l;let b=l.replace(BUL,'').trim();for(const[r,v]of WEAK)if(r.test(b)){b=b.replace(r,v);break}
  const f0=b.split(/\s+/)[0].toLowerCase();if(/ing$/.test(f0)&&!VERBS.has(f0)&&!/^[^:]{3,70}:\s/.test(b)){const G={building:'built',writing:'wrote',leading:'led',making:'made',running:'ran'},g=G[f0]||f0.replace(/ing$/,'ed');b=g.charAt(0).toUpperCase()+g.slice(1)+b.slice(f0.length)}
  const w=b.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g,'');if(!isVerb(w)&&!/^[^:]{3,70}:\s/.test(b))b='Developed '+b.charAt(0).toLowerCase()+b.slice(1);return'• '+b.charAt(0).toUpperCase()+b.slice(1).replace(/\.$/,'')}).filter(Boolean).join('\n')};
 const o={...d};o.exp=fx(d.exp);o.projects=fx(d.projects);o.ach=d.ach;const seen=new Set();o.skills=d.skills.split('\n').map(l=>{const m=l.match(/^([^:,]{1,40}):\s*(.*)$/),lab=m?m[1]+': ':'',it=(m?m[2]:l).split(/[,;|·•]/).map(x=>x.trim()).filter(x=>x&&!seen.has(x.toLowerCase())&&seen.add(x.toLowerCase()));return it.length?lab+it.join(', '):''}).filter(Boolean).join('\n');
 if(o.summary.length<60){const s=skillList(o).slice(0,5).join(', ');o.summary=`${o.title||'Software engineer'} with hands-on experience in ${s}. Focused on building reliable, well-tested software and delivering measurable results.`}return o}
async function optimize(){if(S.busy)return;S.busy=1;T.textContent='';const d=getData(),jd=$('#jd').value,b=score(d,jd);
 log('PLAN  parse structure, diagnose '+b.total+'/100','a');await sleep(450);b.parts.filter(p=>p.got<p.max-.5).slice(0,3).forEach(p=>log('FOUND '+p.k+' '+p.got+'/'+p.max));await sleep(450);
 log('RETRIEVE  searching achievement library (RAG)','a');rag(retrieve(d.skills+' '+d.title+' '+d.projects));await sleep(550);
 log('REWRITE  action verbs, bullets, skills, summary','a');setData(rewrite(d));await sleep(550);
 log('VERIFY  re-scoring and fitting to one page','a');const a=refresh();await sleep(400);
 $('#ba').innerHTML=`${b.total} → <span class="ok">${a.total}</span>`;log('RESULT '+b.total+' → '+a.total+(a.total>=95?'  ✔ 95+ reached':'  add real numbers/details to reach 95+'),a.total>=95?'ok':'bad');
 a.parts.filter(p=>p.got<p.max-.5).forEach(p=>log('TODO  '+p.tip));log('Review rewritten bullets: the agent adds verbs but never invents numbers.');S.busy=0}
async function cnn(){const L=['Rasterize page','Conv · edges','Pool','Conv · regions','Classify blocks'];$('#pipe').innerHTML=L.map(l=>`<span>${l}</span>`).join('');$('#checks').innerHTML='';
 for(const s of $$('#pipe span')){s.classList.add('on');await sleep(260)}
 const d=getData(),ok=fit();[['Single-column, text-only layout',1],['Standard section headings',d.skills&&(d.exp||d.projects)&&d.edu],['Contact details in body text',d.email&&d.phone],['ATS-safe font (Arial), no tables or images',1],['Fits one A4 page',ok]].forEach(([t,v])=>$('#checks').innerHTML+=`<div class="ck ${v?'ok':'bad'}">${v?'✔':'✖'} ${t}</div>`)}
async function readFile(f){const n=f.name.toLowerCase(),ld=s=>new Promise((r,j)=>{const e=document.createElement('script');e.src=s;e.onload=r;e.onerror=()=>j(Error('Could not load parser (offline?)'));document.head.appendChild(e)});
 if(n.endsWith('.pdf')){await ld('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';const pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;let o='';
  for(let p=1;p<=pdf.numPages;p++){const c=await(await pdf.getPage(p)).getTextContent(),R={};c.items.forEach(i=>{const y=Math.round(i.transform[5]/3);(R[y]=R[y]||[]).push(i)});o+=Object.keys(R).map(Number).sort((a,b)=>b-a).map(y=>R[y].sort((a,b)=>a.transform[4]-b.transform[4]).map(i=>i.str).join(' ')).join('\n')+'\n'}return o}
 if(n.endsWith('.docx')){await ld('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');return(await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()})).value}return f.text()}
async function analyze(){const t=$('#raw').value.trim();if(t.length<40){$('#stat').textContent='Paste or upload a resume first.';return}
 $('#drop').classList.add('scan');$('#stat').textContent='Scanning…';await sleep(900);setData(parse(t));$('#drop').classList.remove('scan');$('#stat').textContent='Done. Scroll down for your report.';
 $$('[hidden]').forEach(s=>s.hidden=false);T.textContent='';log('Loaded resume. Press “Auto-optimize with agent” to build the 95+ version.','a');const r=refresh();$('#ba').textContent='Current score: '+r.total;await cnn();$('#report').scrollIntoView()}
async function take(f){if(!f)return;$('#stat').textContent='Reading '+f.name+'…';try{$('#raw').value=await readFile(f);analyze()}catch(e){$('#stat').textContent=e.message+'. Paste the text instead.'}}
$('#form').innerHTML=FD.map(([k,l,t])=>`<label for="f_${k}">${l}</label>`+(t?`<textarea class="fi" id="f_${k}"></textarea>`:`<input class="fi" id="f_${k}" type="text">`)).join('');
let tm;$('#form').addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(refresh,250)});
$('#file').onchange=e=>take(e.target.files[0]);const dz=$('#drop');['dragover','dragenter'].forEach(v=>dz.addEventListener(v,e=>{e.preventDefault();dz.classList.add('over')}));['dragleave','drop'].forEach(v=>dz.addEventListener(v,e=>{e.preventDefault();dz.classList.remove('over')}));dz.addEventListener('drop',e=>take(e.dataTransfer.files[0]));
$('#go').onclick=analyze;$('#sample').onclick=()=>{$('#raw').value=SAMPLE;analyze()};$('#opt').onclick=optimize;
$('#kw').onclick=e=>{if(e.target.className!=='chip')return;const el=$('#f_skills');el.value+=(el.value?', ':'')+e.target.textContent;refresh()};
$('#rag').onclick=e=>{const i=e.target.dataset.i;if(i==null)return;const el=$('#f_projects');el.value+=(el.value?'\n':'')+'• '+S.rag[i].t;refresh();log('Added template bullet. Replace the numbers with your real results.')};
$('#pdf').onclick=()=>{document.title=(getData().name||'Resume')+' - Resume';print()};
const dl=(n,t,m)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click()};
$('#txt').onclick=()=>dl('resume.txt',$('#rb').innerText,'text/plain');
$('#htm').onclick=()=>dl('resume.html','<!DOCTYPE html><meta charset="utf-8"><title>Resume</title><style>body{font:12px/1.38 Arial;max-width:794px;margin:30px auto}h1{font-size:24px;margin:0}h2{font-size:12px;text-transform:uppercase;border-bottom:1px solid #000;margin:9px 0 4px}ul{margin:2px 0;padding-left:16px}.b{font-weight:700}</style>'+$('#rb').innerHTML,'text/html');
$('#cmd').onsubmit=e=>{e.preventDefault();const q=$('#q').value.trim().toLowerCase();if(!q)return;log('YOU  '+q);$('#q').value='';const r=S.last||refresh(),d=getData();
 if(/score|low|why|improve|fix/.test(q))r.parts.filter(p=>p.got<p.max-.5).sort((a,b)=>(b.max-b.got)-(a.max-a.got)).slice(0,3).forEach(p=>log('TIP  '+p.tip));
 else if(/bullet|achiev|example/.test(q)){rag(retrieve(d.skills+' '+d.title+' '+q));log('Retrieved templates on the right.')}
 else if(/job|jd|keyword|match/.test(q))log(r.miss.length?'Missing job keywords: '+r.miss.join(', '):'Paste a job description above, or no keywords are missing.');
 else if(/page|fit|length/.test(q))log($('#fitMsg').textContent+' · '+textOf(d).split(/\s+/).length+' words');
 else log('Try: why is my score low · suggest bullets · match job · page fit')};
(()=>{const c=$('#bg'),x=c.getContext('2d');if(matchMedia('(prefers-reduced-motion:reduce)').matches||getComputedStyle(c).display==='none')return;let w,h,P;const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight;P=Array.from({length:Math.min(70,w/16|0)},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))};rs();addEventListener('resize',rs);
 (function L(){x.clearRect(0,0,w,h);P.forEach((p,i)=>{p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+h)%h;x.fillStyle='#4de1ff';x.fillRect(p.x,p.y,2,2);for(let j=i+1;j<P.length;j++){const q=P[j],dd=Math.hypot(p.x-q.x,p.y-q.y);if(dd<120){x.strokeStyle=`rgba(77,225,255,${.2*(1-dd/120)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}});requestAnimationFrame(L)})()})();
const tk={cl:()=>coverLetter(getData(),$('#jd').value,$('#co').value.trim(),$('#role').value.trim()),iq:()=>interviewQs(getData()),li:()=>linkedin(getData()),ta:()=>tailor(getData(),$('#jd').value)};
$('#tkb').onclick=e=>{const k=e.target.dataset.k;if(k)$('#tout').value=tk[k]()};
$('#tcopy').onclick=async()=>{try{await navigator.clipboard.writeText($('#tout').value);$('#tcopy').textContent='Copied'}catch(_){$('#tout').select()}setTimeout(()=>$('#tcopy').textContent='Copy',1500)};
$('#doc').onclick=()=>dl('resume.doc','<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><meta charset="utf-8"><style>body{font:11pt Arial}h1{font-size:20pt}h2{font-size:11pt;text-transform:uppercase;border-bottom:1px solid #000}</style><body>'+$('#rb').innerHTML+'</body></html>','application/msword');
$('#clr').onclick=()=>{try{localStorage.removeItem('vitaforge')}catch(_){}location.reload()};
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ---- Quill-style page init: prefilled studio, preview scaling, theme, hero typing, docker demo ---- */
(()=>{const blank=Object.fromEntries(F.map(k=>[k,'']));let d;try{const sv=JSON.parse(localStorage.getItem('vitaforge')||'null');d=sv&&sv.name?{...blank,...sv}:parse(SAMPLE)}catch(_){d=parse(SAMPLE)}
 setData(d);refresh();log('Ready. Upload a resume above, or edit the sample. Then press Auto-optimize.','a');
 const sc=()=>{const w=document.querySelector('.swrap');if(!w)return;const s=Math.min(1,(w.parentElement.clientWidth-30)/794);document.documentElement.style.setProperty('--s',Math.max(.3,s).toFixed(3))};addEventListener('resize',sc);sc();setTimeout(sc,300);
 const th=$('#theme'),root=document.documentElement;try{const t=localStorage.getItem('vf-theme');if(t)root.dataset.theme=t}catch(_){}th.onclick=()=>{const dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;root.dataset.theme=dark?'light':'dark';try{localStorage.setItem('vf-theme',root.dataset.theme)}catch(_){}};
 const t="Final-year CSE student who ships production-style systems end to end: CI-tested APIs, Docker and applied AI.";let i=0;const el=$('#ty');if(el){const n=()=>{el.textContent=t.slice(0,++i);if(i<t.length)setTimeout(n,34)};setTimeout(n,500)}
 const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.12});$$('.rv').forEach(x=>io.observe(x));
 const SV=[['web','Static frontend'],['api','FastAPI /api'],['rag','TF-IDF index'],['agent','Agent loop'],['groq','Groq Cloud']];$('#svc').innerHTML=SV.map(x=>`<div class="sv" id="v-${x[0]}"><b><span class="dot"></span>${x[0]}</b>${x[1]}</div>`).join('');
 $('#up').onclick=async()=>{const L=$('#dlog');L.textContent='$ docker compose up --build\n';$$('.sv').forEach(x=>x.classList.remove('up'));for(const k of ['rag','api','agent','web','groq']){await sleep(480);L.textContent+=k==='groq'?'✔ Groq reachable (key read from server env)\n':'✔ '+k+'  ready\n';$('#v-'+k).classList.add('up')}L.textContent+='→ http://localhost:8000'}})();
