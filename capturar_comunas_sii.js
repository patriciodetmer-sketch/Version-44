// Extrae la tabla oficial comuna->código del SII. 
// En https://www4.sii.cl/mapasui/internet/  -> F12 Console -> (allow pasting) -> pega -> Enter
// Descarga: sii_comunas.json  (súbelo al chat)
(async () => {
  const meta=ns=>({namespace:'cl.sii.sdi.lob.bbrr.mapas.data.api.interfaces.MapasFacadeService/'+ns,
    conversationId:'UNAUTHENTICATED-CALL',transactionId:(crypto.randomUUID?crypto.randomUUID():Date.now()+'')});
  const base='https://www4.sii.cl/mapasui/services/data/mapasFacadeService/';
  const cand=['getRegiones','getComunas','getRegionComuna','getRegionesComunas','getCatalogoComunas','getComuna'];
  const out={};
  for(const ns of cand){
    try{
      const r=await fetch(base+ns,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({metaData:meta(ns),data:{}})});
      const j=await r.json();
      out[ns]={status:r.status, data:j&&j.data?j.data:j};
      console.log(ns, r.status, JSON.stringify(j).slice(0,120));
    }catch(e){ out[ns]={error:e.message}; }
  }
  const b=new Blob([JSON.stringify(out,null,1)],{type:'application/json'});
  const a=document.createElement('a'); a.href=window.URL.createObjectURL(b); a.download='sii_comunas.json'; a.click();
  console.log('LISTO. Sube sii_comunas.json');
})();
