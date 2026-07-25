// DIAGNÓSTICO capa PRC MINVU — compara Antofagasta (Calama) vs RM (Santiago, que sabemos que sí anda).
// Pega en la consola de la plataforma (F12) con internet. Copia el resultado al chat.
(async () => {
  const R=6378137,D=Math.PI/180;
  const to=(lon,lat)=>[lon*R*D, Math.log(Math.tan((90+lat)*D/2))*R];
  const box=(lon,lat,h)=>{const [x,y]=to(lon,lat);return [x-h,y-h,x+h,y+h].join(',');};
  const svc={
    'Antofagasta (Calama)':['PRC_Antofagasta', box(-68.929,-22.456,1500)],
    'Antofagasta (ciudad)':['PRC_Antofagasta', box(-70.398,-23.650,2000)],
    'RM (Santiago centro)':['PRC_RM_Norte',   box(-70.650,-33.44,1200)],
  };
  const B='https://geoide.minvu.cl/server/rest/services/IPT/';
  for(const [name,[s,bbox]] of Object.entries(svc)){
    // 1) metadata
    let meta='?';
    try{ const r=await fetch(B+s+'/MapServer?f=json'); meta=r.status; }catch(e){ meta='ERR '+e.message; }
    // 2) export imagen
    const u=B+s+'/MapServer/export?bbox='+encodeURIComponent(bbox)+'&bboxSR=3857&imageSR=3857&size=400,400&format=png&transparent=true&f=image';
    try{
      const r=await fetch(u); const ct=r.headers.get('content-type')||''; const buf=await r.arrayBuffer();
      console.log(name,'| meta HTTP',meta,'| export HTTP',r.status,'|',ct,'| bytes:',buf.byteLength,(ct.includes('image')&&buf.byteLength>1500?' ✓ dibuja':' ✗ vacío/no-imagen'));
    }catch(e){ console.log(name,'| meta',meta,'| export ERROR',e.message); }
  }
  console.log('LISTO — copia estas 3 líneas al chat.');
})();
