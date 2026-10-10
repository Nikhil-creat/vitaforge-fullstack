'use strict';
/* Dependency-free DOCX export: ATS-safe, single column, real bullets, auto-fit to one A4 page.
   Designed & developed by NIKHIL CHARY SRIRAMOJU */
const VFX=(()=>{
 const T=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;T[n]=c>>>0}
 const crc=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=T[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
 const enc=s=>new TextEncoder().encode(s),u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];
 function zip(files){const out=[],cd=[];let off=0;
  for(const f of files){const nm=enc(f.name),d=enc(f.data),c=crc(d);
   const lh=[0x50,0x4b,3,4,...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0)];
   out.push(new Uint8Array(lh),nm,d);
   cd.push(new Uint8Array([0x50,0x4b,1,2,...u16(20),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nm);
   off+=lh.length+nm.length+d.length}
  const cl=cd.reduce((a,b)=>a+b.length,0),end=new Uint8Array([0x50,0x4b,5,6,...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cl),...u32(off),...u16(0)]);
  const all=[...out,...cd,end],res=new Uint8Array(all.reduce((a,b)=>a+b.length,0));let p=0;for(const a of all){res.set(a,p);p+=a.length}return res}
 const X=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const lines=t=>(t||'').split('\n').map(s=>s.trim()).filter(Boolean);
 function items(d){const it=[],H=(t,body)=>{if(body.length){it.push({t:t.toUpperCase(),k:'h'});body.forEach(x=>it.push(x))}};
  const blk=t=>lines(t).map(l=>BUL.test(l)?{t:l.replace(BUL,''),k:'li'}:{t:l,k:'b'});
  it.push({t:d.name||'Your Name',k:'name'});if(d.title)it.push({t:d.title,k:'title'});
  [[d.loc,d.phone,d.email],[d.linkedin,d.github]].map(r=>r.filter(Boolean).join(' | ')).forEach(c=>c&&it.push({t:c,k:'contact'}));
  H('Professional Summary',d.summary?[{t:d.summary,k:'p'}]:[]);H('Technical Skills',lines(d.skills).map(l=>{const m=l.match(/^([^:,]{1,40}):\s*(.*)$/);return m?{t:m[1]+': '+m[2],lbl:m[1]+': ',k:'p'}:{t:l,k:'p'}}));
  H('Experience',blk(d.exp));H('Projects',blk(d.projects));H('Education',blk(d.edu));H('Certifications',blk(d.certs));H('Achievements',blk(d.ach));return it}
 const SP={name:[0,20],title:[0,20],contact:[0,20],h:[130,50],b:[50,10],li:[0,10],p:[0,10]};
 const fs=(k,pt)=>k==='name'?pt+7:k==='title'?pt+1:pt;
 const est=(it,pt)=>it.reduce((h,i)=>{const f=fs(i.k,pt),cpl=Math.floor((515-(i.k==='li'?15:0))/(f*(/^(b|h|name|title)$/.test(i.k)?.56:.5)));return h+Math.max(1,Math.ceil(i.t.length/cpl))*f*1.18+(SP[i.k][0]+SP[i.k][1])/20+(i.k==='h'?1.5:0)},0);
 const R=(t,b,z)=>`<w:r><w:rPr>${b?'<w:b/>':''}<w:sz w:val="${z}"/><w:szCs w:val="${z}"/></w:rPr><w:t xml:space="preserve">${X(t)}</w:t></w:r>`;
 const para=(i,pt)=>{const[b,a]=SP[i.k],bold=/^(b|h|name|title)$/.test(i.k),z=Math.round(fs(i.k,pt)*2);
  return`<w:p><w:pPr>${i.k==='h'||i.k==='b'?'<w:keepNext/>':''}${i.k==='li'?'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>':''}${i.k==='h'?'<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/></w:pBdr>':''}<w:spacing w:before="${b}" w:after="${a}" w:line="240" w:lineRule="auto"/></w:pPr>${i.lbl?R(i.lbl,1,z)+R(i.t.slice(i.lbl.length),0,z):R(i.t,bold,z)}</w:p>`};
 const NS='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"',HD='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
 function build(d,force){const it=items(d);let pt=10.5;for(const c of [10.5,10,9.5,9,8.5,8]){pt=c;if(est(it,c)<=781*.99)break}if(force)pt=force;
  const doc=`${HD}<w:document ${NS}><w:body>${it.map(i=>para(i,pt)).join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="600" w:right="800" w:bottom="600" w:left="800" w:header="300" w:footer="300" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const files=[
  {name:'[Content_Types].xml',data:`${HD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`},
  {name:'_rels/.rels',data:`${HD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`},
  {name:'word/document.xml',data:doc},
  {name:'word/_rels/document.xml.rels',data:`${HD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`},
  {name:'word/styles.xml',data:`${HD}<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style></w:styles>`},
  {name:'word/numbering.xml',data:`${HD}<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="300" w:hanging="200"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`},
  {name:'docProps/core.xml',data:`${HD}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${X((d.name||'Resume')+' - Resume')}</dc:title><dc:creator>${X(d.name||'')}</dc:creator><dc:description>Built with VitaForge. Designed and developed by NIKHIL CHARY SRIRAMOJU.</dc:description></cp:coreProperties>`}];
  return{bytes:zip(files),pt}}
 const download=d=>{const r=build(d),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([r.bytes],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));a.download=(d.name||'Resume').replace(/[^\w]+/g,'_')+'_Resume.docx';a.click()};
 return{build,download,est,items}})();
if(typeof document!=='undefined')document.getElementById('doc').onclick=()=>VFX.download(getData());
