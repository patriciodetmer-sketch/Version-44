// SONDA INFRAESTRUCTURA — busca capas de RED VIAL y RED ELÉCTRICA (subestaciones/líneas) de Chile.
// Corre en una pestaña de arcgis.com. F12 Console -> pega -> Enter. Descarga probe_infra.json.
(async () => {
  const j=async u=>{ try{const r=await fetch(u,{headers:{'Accept':'application/json'}});return await r.json();}catch(e){return {error:String(e)};} };
  const SH='https://www.arcgis.com/sharing/rest/search';
  const queries=['red vial Chile','caminos Chile MOP','subestaciones eléctricas Chile','líneas transmisión Chile',
    'red eléctrica Chile','vialidad Chile ruta','sistema eléctrico nacional Chile subestacion'];
  const items={};
  for(const qq of queries){ for(let st=1; st>0 && st<120;){
    const u=SH+'?f=json&num=50&start='+st+'&q='+encodeURIComponent(qq+' (type:"Feature Service" OR type:"Map Service")');
    const d=await j(u); const res=(d&&d.results)||[];
    for(const it of res){ if(it.url) items[it.id]={title:it.title,owner:it.owner,type:it.type,url:it.url,q:qq}; }
    st=(d&&d.nextStart>0)?d.nextStart:-1; await new Promise(z=>setTimeout(z,120));
  } }
  console.log('%ccandidatas:'+Object.keys(items).length,'color:#09c;font-weight:bold');
  const rep=[];
  for(const it of Object.values(items)){
    const meta=await j(it.url+'?f=json');
    const lys=(meta&&(meta.layers||[]))||[];
    let info=null;
    for(const ly of lys.slice(0,3)){
      const lm=await j(it.url.replace(/\/\d+$/,'')+'/'+ly.id+'?f=json');
      const flds=(lm&&lm.fields||[]).map(f=>f.name);
      info={layer:ly.id,name:lm&&lm.name,geom:lm&&lm.geometryType,count:lm&&lm.count,fields:flds.slice(0,18)}; break;
    }
    rep.push({title:it.title,owner:it.owner,url:it.url,q:it.q,info});
    const g=info&&info.geom||'';
    console.log('  ',/Line/.test(g)?'〰️':/Point/.test(g)?'📍':/Polygon/.test(g)?'⬛':'—','|',it.title,'| owner:',it.owner,'|',it.url);
  }
  const b=new Blob([JSON.stringify(rep,null,1)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='probe_infra.json'; document.body.appendChild(a); a.click(); a.remove();
  console.log('%cLISTO. Sube probe_infra.json y copia el resumen.','color:#0a0;font-weight:bold;font-size:14px');
})();
