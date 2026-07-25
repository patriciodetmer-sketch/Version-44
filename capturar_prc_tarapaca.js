// ============================================================================
//  CAPTURA PRC TARAPACÁ — 90 predios (Iquique, Alto Hospicio, Pozo Almonte, Huara…)
//  El servicio tiene acento en la URL; se prueban variantes y se fuerzan las capas.
//   Abre plataforma/pestaña con internet -> F12 Console -> pega -> Enter.
//   Descarga prc_tarapaca.csv -> súbelo.
// ============================================================================
(async () => {
  const P=[[750,-20.706566,-70.191553,"T"],[751,-20.24771,-70.084315,"T"],[753,-20.487627,-69.312425,"T"],[754,-20.431222,-70.144,"T"],[755,-20.288855,-70.123186,"T"],[757,-20.281742,-70.090937,"T"],[758,-20.266879,-70.066565,"T"],[759,-20.281544,-70.091367,"T"],[760,-20.249045,-70.077096,"T"],[761,-20.249444,-70.095488,"T"],[762,-20.249549,-70.096728,"T"],[763,-20.28564,-70.088641,"T"],[764,-20.296684,-70.068902,"T"],[765,-20.297075,-70.070027,"T"],[766,-20.247522,-70.096912,"T"],[767,-20.2626,-70.073645,"T"],[768,-20.272143,-70.087023,"T"],[769,-20.29075,-70.120009,"T"],[770,-20.259928,-69.777919,"T"],[771,-20.282876,-70.091074,"T"],[772,-20.510246,-69.355198,"T"],[773,-20.3474,-69.65075,"T"],[774,-20.073211,-69.200794,"T"],[775,-20.48117,-69.341819,"T"],[776,-20.327336,-69.655578,"T"],[777,-20.346937,-69.651472,"T"],[778,-20.35004,-69.651832,"T"],[779,-20.282557,-70.088438,"T"],[780,-20.343658,-69.651351,"T"],[781,-20.259064,-69.774631,"T"],[782,-20.356876,-69.654203,"T"],[783,-20.274784,-70.087087,"T"],[784,-20.248367,-70.093429,"T"],[785,-20.34371,-69.652513,"T"],[786,-20.272689,-70.08679,"T"],[787,-20.291531,-70.083539,"T"],[788,-20.284174,-70.088124,"T"],[789,-20.259064,-69.774631,"T"],[790,-20.285313,-70.101981,"T"],[792,-20.24952,-70.094128,"T"],[793,-20.290562,-70.083484,"T"],[795,-20.248219,-70.094394,"T"],[796,-20.239318,-70.137907,"T"],[797,-20.259064,-69.774631,"T"],[798,-20.265269,-69.778455,"T"],[799,-20.250168,-70.104301,"T"],[800,-20.249114,-70.094357,"T"],[801,-19.861386,-69.429928,"T"],[802,-19.861295,-69.429526,"T"],[803,-20.259064,-69.774631,"T"],[804,-20.247504,-70.094511,"T"],[805,-20.247277,-70.093959,"T"],[806,-20.249321,-70.101341,"T"],[807,-20.257315,-69.775782,"T"],[808,-20.26229,-70.099265,"T"],[809,-20.282862,-70.091079,"T"],[810,-20.214367,-70.147451,"T"],[811,-20.247624,-70.135829,"T"],[812,-20.272659,-70.087252,"T"],[813,-20.662954,-70.183443,"T"],[814,-20.254864,-69.778132,"T"],[815,-20.258725,-69.780498,"T"],[816,-20.359062,-69.653629,"T"],[817,-20.258921,-69.780497,"T"],[818,-20.000864,-69.772191,"T"],[819,-19.923073,-69.514711,"T"],[832,-20.425757,-70.15448,"T"],[833,-20.251215,-70.066319,"T"],[834,-21.631159,-69.549978,"T"],[835,-20.486648,-69.345261,"T"],[836,-19.771316,-69.796795,"T"],[837,-20.316219,-69.657972,"T"],[839,-20.219325,-70.147359,"T"],[840,-20.134145,-69.181711,"T"],[841,-20.931239,-69.05055,"T"],[854,-20.432839,-70.15131,"T"],[856,-20.284762,-70.101082,"T"],[857,-20.706566,-70.191553,"T"],[858,-20.264172,-70.0979,"T"],[859,-20.282862,-70.091079,"T"],[860,-20.297,-70.06857,"T"],[861,-20.292378,-70.082775,"T"],[865,-20.512162,-69.356242,"T"],[866,-20.260687,-69.767535,"T"],[868,-20.250308,-70.104232,"T"],[869,-20.515396,-69.360437,"T"],[870,-20.273682,-70.08801,"T"],[871,-19.742586,-69.219741,"T"],[913,-20.282107,-70.083255,"T"],[1014,-19.742623,-69.219856,"T"]];                          // [[id,lat,lon,'T'],...]
  const CANDS=['PRC_Tarapac%C3%A1','PRC_Tarapacá','PRC_Tarapaca'];
  const B='https://geoide.minvu.cl/server/rest/services/IPT/';
  const R=6378137,D=Math.PI/180; const to=(lon,lat)=>[lon*R*D, Math.log(Math.tan((90+lat)*D/2))*R];
  let jc=0;
  function jsonp(url){ return new Promise(res=>{ const cb='__t'+(jc++); const s=document.createElement('script');
    const t=setTimeout(()=>{cl();res(null);},15000); function cl(){clearTimeout(t);delete window[cb];s.remove();}
    window[cb]=d=>{cl();res(d);}; s.onerror=()=>{cl();res(null);};
    s.src=url+(url.includes('?')?'&':'?')+'f=json&callback='+cb; document.body.appendChild(s); }); }
  // 1) elegir el nombre de servicio que responde y sus capas
  let SVC=null, LAYERS=null;
  for(const c of CANDS){
    const meta=await jsonp(B+c+'/FeatureServer');
    if(meta&&(meta.layers||meta.serviceDescription!==undefined)){
      SVC=c; LAYERS=(meta.layers||[]).map(l=>({id:l.id,name:l.name||''}));
      console.log('%cServicio Tarapacá OK: '+c+' · capas: '+LAYERS.length,'color:#0a0;font-weight:bold');
      console.log('   capas:',LAYERS.map(l=>l.id+':'+l.name).join(' | ')); break;
    } else console.log('   no responde:',c);
  }
  if(!SVC){ console.log('%cNingún nombre de servicio respondió. Copia esto al chat.','color:#c00;font-weight:bold'); return; }
  if(!LAYERS||!LAYERS.length){ LAYERS=Array.from({length:30},(_,i)=>({id:i,name:''})); console.log('   sin metadata de capas → fuerzo ids 0..29'); }
  const pick=(a,re)=>{ for(const k of Object.keys(a)){ if(re.test(k)){ const v=a[k]; if(v!=null&&String(v).trim()&&String(v).trim().toLowerCase()!=='null') return String(v).trim(); } } return ''; };
  async function queryPt(lon,lat){ const [x,y]=to(lon,lat);
    const geom=encodeURIComponent(JSON.stringify({x,y,spatialReference:{wkid:3857}}));
    for(const L of LAYERS){
      const u=B+SVC+'/FeatureServer/'+L.id+'/query?geometry='+geom+'&geometryType=esriGeometryPoint&inSR=3857&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false';
      const j=await jsonp(u); const fs=(j&&j.features)||[];
      for(const fe of fs){ const a=fe.attributes||{}; if(Object.keys(a).some(k=>/uso|zona|uperm/i.test(k))) return {a,layer:L.name}; }
      if(fs.length) return {a:fs[0].attributes||{},layer:L.name};
    } return null; }
  const rows=[]; let done=0,hit=0,idx=0;
  async function worker(){ while(idx<P.length){ const k=idx++; const [id,lat,lon]=P[k];
    let r=null; try{ r=await queryPt(lon,lat); }catch(e){}
    if(r&&r.a){ const a=r.a; const z=pick(a,/^zona$|zona|sigla/i), up=pick(a,/uperm|permit|uso.*perm|uso.*suelo/i);
      if(z||up) hit++;
      rows.push({id,region:'Tarapacá',capa:r.layer||'',zona:z,zona_nombre:pick(a,/nombre.*zon|zona.*nombre|^nombre$|glosa/i),
        uso_permitido:up,uso_prohibido:pick(a,/uproh|prohib/i),instrumento:pick(a,/instrumento|plan|ipt/i)||r.layer||'',
        fecha_do:pick(a,/fecha|d\.?o|diario|publica/i),decreto:pick(a,/decreto|resol|documento/i),raw:JSON.stringify(a).slice(0,1200)});
    } else rows.push({id,region:'Tarapacá',capa:'',zona:'',zona_nombre:'',uso_permitido:'',uso_prohibido:'',instrumento:'',fecha_do:'',decreto:'',raw:''});
    done++; if(done%15===0) console.log('  ',done+'/'+P.length,'| con norma:',hit); await new Promise(z=>setTimeout(z,140)); } }
  console.log('%cConsultando '+P.length+' predios de Tarapacá…','color:#09c;font-weight:bold');
  await Promise.all(Array.from({length:3},worker));
  rows.sort((a,b)=>a.id-b.id);
  const H=['id','region','capa','zona','zona_nombre','uso_permitido','uso_prohibido','instrumento','fecha_do','decreto','raw'];
  const csv='﻿'+H.join(';')+'\n'+rows.map(r=>H.map(k=>'"'+String(r[k]==null?'':r[k]).replace(/"/g,'""')+'"').join(';')).join('\n');
  const b=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='prc_tarapaca.csv'; document.body.appendChild(a); a.click(); a.remove();
  console.log('%c[LISTO] '+rows.length+' · con norma: '+hit+'. Sube prc_tarapaca.csv','color:#0a0;font-weight:bold;font-size:14px');
})();
