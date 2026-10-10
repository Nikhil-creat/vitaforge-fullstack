'use strict';
/* VitaForge AI layer: talks to the FastAPI backend. Groq runs server-side; no key in the browser.
   Designed & developed by NIKHIL CHARY SRIRAMOJU */
const AI={base:String(window.VF_API||'').replace(/\/$/,''),on:false,hist:[],undo:null,pending:null,busy:0};
const aiEl=id=>document.getElementById(id);
AI.post=async(path,body)=>{const r=await fetch(AI.base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const t=await r.json().catch(()=>({}));if(!r.ok)throw new Error(t.detail||('Request failed ('+r.status+')'));return t};
AI.payload=()=>({resume:getData(),jd:$('#jd').value.slice(0,6000)});
const aiOut=t=>{aiEl('aiout').textContent=t};
const setB=v=>document.querySelectorAll('#aib button,#iq,#ifb').forEach(b=>b.disabled=v);
const FALLBACK={cover_letter:()=>coverLetter(getData(),$('#jd').value,$('#co').value.trim(),$('#role').value.trim()),linkedin:()=>linkedin(getData()),tailor:()=>tailor(getData(),$('#jd').value),interview_questions:()=>interviewQs(getData())};
const lst=a=>(Array.isArray(a)?a:[]).map(x=>'• '+(typeof x==='string'?x:JSON.stringify(x))).join('\n')||'• none';
const fmtAgent=r=>r.trace.map(t=>'› '+t.step.toUpperCase()+': '+(Array.isArray(t.detail)?t.detail.join(' | '):t.detail)).join('\n')+'\n\nCritic: '+(r.critic.passed?'passed ✔':'issues found, guardrail applied')+'\nNew summary:\n'+r.resume.summary+'\n\nPress “Apply to resume”. Replace any [X] placeholders with your real numbers.';
const fmtReview=r=>'VERDICT\n'+r.verdict+'\n\nSTRENGTHS\n'+lst(r.strengths)+'\n\nWEAKNESSES\n'+lst(r.weaknesses)+'\n\nMISSING KEYWORDS\n'+(r.missing_keywords.join(', ')||'none')+'\n\nSUMMARY REWRITE\n'+r.summary_rewrite+'\n\nBULLET IDEAS\n'+r.bullet_suggestions.map(b=>'• '+b.original+'\n  → '+b.improved).join('\n');
AI.run=async a=>{if(AI.busy)return;AI.busy=1;setB(true);aiOut('Working…');aiEl('aiapply').classList.add('off');
 try{
  if(!AI.on){if(FALLBACK[a]){aiOut('[Offline: local template]\n\n'+FALLBACK[a]());return}throw new Error('AI backend not reachable. Start the server or set VF_API in config.js.')}
  if(a==='agent'){const r=await AI.post('/api/agent/run',AI.payload());AI.pending=r.resume;aiOut(fmtAgent(r));aiEl('aiapply').classList.remove('off')}
  else if(a==='review'){const r=await AI.post('/api/ai/review',AI.payload());AI.pending=r.summary_rewrite?{summary:r.summary_rewrite}:null;aiOut(fmtReview(r));if(AI.pending)aiEl('aiapply').classList.remove('off')}
  else{const r=await AI.post('/api/ai/generate',{...AI.payload(),kind:a,company:$('#co').value.trim(),role:$('#role').value.trim()});aiOut(r.text)}
 }catch(e){aiOut(FALLBACK[a]?'AI unavailable ('+e.message+'). Local template instead:\n\n'+FALLBACK[a]():'⚠ '+e.message)}
 finally{AI.busy=0;setB(false)}};
aiEl('aib').onclick=e=>{const a=e.target.dataset.a;if(a)AI.run(a)};
aiEl('aiapply').onclick=()=>{if(!AI.pending)return;AI.undo=getData();setData({...getData(),...AI.pending});refresh();aiEl('aiapply').classList.add('off');aiEl('aiundo').classList.remove('off');log('AI changes applied. Fill in any [X] placeholders.')};
aiEl('aiundo').onclick=()=>{if(AI.undo){setData(AI.undo);refresh();aiEl('aiundo').classList.add('off')}};
// mock interview
aiEl('iq').onclick=async()=>{setB(true);try{if(AI.on){aiEl('iqq').textContent=(await AI.post('/api/ai/generate',{...AI.payload(),kind:'interview_question',company:$('#co').value.trim(),role:$('#role').value.trim()})).text}else{const q=interviewQs(getData()).split('\n');aiEl('iqq').textContent=q[Math.floor(Math.random()*q.length)].replace(/^\d+\.\s*/,'')}}catch(e){aiEl('iqq').textContent='⚠ '+e.message}setB(false)};
aiEl('ifb').onclick=async()=>{const q=aiEl('iqq').textContent,a=aiEl('ians').value.trim();if(!a)return;if(!AI.on){aiOut('Feedback needs the AI backend. Tip: use STAR (Situation, Task, Action, Result) and include one number.');return}
 setB(true);aiOut('Reviewing your answer…');try{const r=await AI.post('/api/ai/interview/feedback',{question:q,answer:a,resume:getData()});aiOut('SCORE: '+r.score+'/10\n\n'+r.feedback+'\n\nSTRONGER ANSWER\n'+r.improved_answer)}catch(e){aiOut('⚠ '+e.message)}setB(false)};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR)aiEl('mic').onclick=()=>{const r=new SR();r.lang='en-IN';r.onresult=e=>{aiEl('ians').value+=' '+e.results[0][0].transcript};r.start()};else aiEl('mic').classList.add('off');
// streaming chat
const bubble=(c,t)=>{const d=document.createElement('div');d.className=c;d.textContent=t;aiEl('cmsgs').appendChild(d);aiEl('cmsgs').scrollTop=1e9;return d};
aiEl('cform').onsubmit=async e=>{e.preventDefault();const q=aiEl('cin').value.trim();if(!q)return;aiEl('cin').value='';bubble('u','You: '+q);
 if(!AI.on){bubble('a','Chat needs the AI backend. Start the server and reload.');return}
 AI.hist.push({role:'user',content:q});const el=bubble('a','');let txt='';
 try{const r=await fetch(AI.base+'/api/ai/chat/stream',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:AI.hist.slice(-8),...AI.payload()})});
  if(!r.ok){el.textContent='⚠ '+((await r.json().catch(()=>({}))).detail||r.status);return}
  const rd=r.body.getReader(),dec=new TextDecoder();let buf='';
  for(;;){const{done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let i;while((i=buf.indexOf('\n\n'))>=0){const ev=buf.slice(0,i);buf=buf.slice(i+2);if(!ev.startsWith('data: '))continue;const p=ev.slice(6);if(p==='[DONE]')continue;try{const o=JSON.parse(p);txt+=o.error?'\n⚠ '+o.error:o.t}catch(_){}el.textContent=txt;aiEl('cmsgs').scrollTop=1e9}}
  AI.hist.push({role:'assistant',content:txt.slice(0,2000)})}catch(err){el.textContent='⚠ '+err.message}};
// parse PDFs/DOCX on the server when available (more reliable than the CDN parser)
const _rf=readFile;readFile=async f=>{if(AI.on&&/\.(pdf|docx)$/i.test(f.name)){try{const fd=new FormData();fd.append('file',f);const r=await fetch(AI.base+'/api/parse',{method:'POST',body:fd});if(r.ok)return(await r.json()).text}catch(_){}}return _rf(f)};
(async()=>{try{const j=await(await fetch(AI.base+'/api/health')).json();AI.on=true;aiEl('aistat').textContent=j.ai?'● Groq online':'● API up · add GROQ_API_KEY'}catch(_){aiEl('aistat').textContent='○ offline · local mode'}})();
