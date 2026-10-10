'use strict';
/* "Under the hood" explorer. Designed & developed by NIKHIL CHARY SRIRAMOJU */
(()=>{
 const N=[
 ['Upload','read the file','Your PDF, DOCX or TXT is read in the browser (pdf.js, mammoth) or on your own server (pypdf, python-docx). Nothing is stored unless you save it.',['pdf.js','mammoth','pypdf','python-docx'],'js/app.js · backend/app/parsing.py','const text = await readFile(file)\n// pdf.js / mammoth in browser, or\n// POST /api/parse → pypdf / python-docx'],
 ['Parse','find the structure','Rules tuned on real resumes detect headings, bullets, wrapped PDF lines, contact details and labelled skills, so a project title is never mistaken for a bullet.',['headings','bullet merge','skills labels'],'js/app.js → parse()','parse(text)\n→ { name, title, loc, skills,\n    exp, projects, edu, certs, ach }'],
 ['Score','10 ATS checks','Contact, sections, skills, action verbs, measurable impact, length, bullet quality, links, certifications and job keywords add up to a 100-point score with a fix list.',['10-part rubric','job keywords','fix list'],'js/app.js → score()','score(resume, jobDescription)\n→ { total: 96, parts: [10 checks] }'],
 ['Retrieve','RAG library','Your skills and title become a query. TF-IDF cosine similarity finds the closest achievement templates, which style the rewrite without supplying facts.',['TF-IDF','cosine','20 templates on server'],'backend/app/rag.py','search("docker api latency", k=4)\n→ [{ id, text, score }]'],
 ['Agent','diagnose, rewrite, critic','A planner diagnoses weak spots, Llama on Groq rewrites, a critic compares against the original, and one revision pass fixes what it finds.',['Groq','Llama 3.3 70B','Llama 3.1 8B','JSON mode'],'backend/app/agent.py','diagnose (8B) → rewrite (70B)\n→ critic (8B) → revise once\n→ guardrail'],
 ['Guardrail','no invented facts','Any number that was not in your resume is replaced with [X]. Resume text is passed as untrusted data, and AI output is rendered as text, never HTML.',['[X] redaction','prompt-injection safe','rate limit'],'backend/app/util.py · prompts.py','bad = invented_numbers(original, draft)\ndraft = redact_numbers(draft, bad)'],
 ['Export','one page, real DOCX','A hand-written OOXML writer builds a validated Word file with real bullets, and the layout auto-fits one A4 page. PDF comes from print.',['DOCX','PDF','TXT','HTML'],'js/export.js','VFX.build(resume)\n→ valid .docx, real bullets, 1 A4 page']];
 const flow=$('#flow'),det=$('#fdet');let cur=-1,timer=null;
 flow.innerHTML=N.map((n,i)=>`<button class="fn" data-i="${i}"><b>${i+1}</b><span>${n[0]}</span><small>${n[1]}</small></button>`).join('');
 const sel=i=>{cur=i;$$('.fn',flow).forEach((b,k)=>b.classList.toggle('on',k===i));const n=N[i];
  det.innerHTML=`<p class="mu mono">STAGE ${i+1} OF ${N.length}</p><h3>${n[0]}: ${n[1]}</h3><p>${n[2]}</p><div class="tg">${n[3].map(t=>`<span>${t}</span>`).join('')}</div><p class="mu">Code: <code>${n[4]}</code></p><pre class="snip">${esc(n[5])}</pre>`};
 flow.onclick=e=>{const b=e.target.closest('.fn');if(!b)return;clearInterval(timer);sel(+b.dataset.i)};
 sel(0);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)timer=setInterval(()=>sel((cur+1)%N.length),3200);
 // live RAG
 const rq=$('#ragq'),ro=$('#ragout');const rr=()=>{const h=retrieve(rq.value,3);ro.innerHTML=h.length&&h[0].s>0?h.map(x=>`<div class="rr">${esc(x.t)}<br><small class="mu">match ${Math.round(x.s*100)}%</small><i><b style="width:${Math.max(4,x.s*100)}%"></b></i></div>`).join(''):'<p class="mu">No close match. Try “react dashboard” or “pytorch cnn”.</p>'};
 rq.oninput=rr;rr();
 // live guardrail
 const NUM=/\d+(?:[.,]\d+)?/g,go=$('#gorig'),gn=$('#gnew'),gt=$('#gout');
 const gr=()=>{const base=new Set(go.value.match(NUM)||[]),bad=[...new Set((gn.value.match(NUM)||[]).filter(x=>!base.has(x)))];
  gt.innerHTML=bad.length?'Invented numbers: <b>'+bad.map(esc).join(', ')+'</b>\n→ '+esc(gn.value).replace(NUM,m=>bad.includes(m)?'<mark class="rd">[X]</mark>':m):'<span class="ok">✔ No invented numbers. This draft passes.</span>'};
 go.oninput=gn.oninput=gr;gr();
 // counters
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;io.unobserve(x.target);const to=+x.target.dataset.n,t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/900);x.target.textContent=Math.round(to*p);if(p<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
 $$('.stats b').forEach(b=>io.observe(b));
})();
