// SONDA ArcGIS — busca capas de Áreas Homogéneas / Zonas Homogéneas (valor de suelo SII)
// en ArcGIS Online y revisa cobertura + campos de valor. Corre en CUALQUIER pestaña
// (mejor una ya abierta de arcgis.com o del visor de Bienes Nacionales).
//  F12 -> Console -> pega -> Enter. Descarga probe_arcgis_ah.json y muestra resumen.
(async () => {
  const j=async u=>{ try{ const r=await fetch(u,{headers:{'Accept':'application/json'}}); return await r.json(); }catch(e){ return {error:String(e)}; } };
  const SH='https://www.arcgis.com/sharing/rest/search';
  const queries=[
    'áreas homogéneas SII','areas homogeneas valor unitario','zonas homogéneas geoeconómicas',
    'áreas homogéneas terreno','valor unitario terreno SII','area homogenea avaluo'];
  const items={};
  for(const qq of queries){
    for(let start=1; start>0 && start<200; ){
      const u=SH+'?f=json&num=100&start='+start+'&q='+encodeURIComponent(qq+' (type:"Feature Service" OR type:"Map Service")');
      const d=await j(u); const res=(d&&d.results)||[];
      for(const it of res){ if(it.url) items[it.id]={title:it.title,owner:it.owner,type:it.type,url:it.url,id:it.id,q:qq}; }
      start = (d&&d.nextStart>0)? d.nextStart : -1;
      await new Promise(z=>setTimeout(z,150));
    }
  }
  const known=[
    'https://services9.arcgis.com/7ZGljRNfwE7RQXlF/ArcGIS/rest/services/Zonas_Homog%C3%A9neas_Geoecon%C3%B3micas_WFL1/FeatureServer'];
  for(const u of known){ if(!Object.values(items).some(i=>i.url&&i.url.includes('Zonas_Homog'))) items['known_'+Object.keys(items).length]={title:'(known) Zonas Homogeneas Geoeconomicas',url:u,type:'Feature Service'}; }

  console.log('%cCapas candidatas encontradas: '+Object.keys(items).length,'color:#09c;font-weight:bold');
  const report=[];
  for(const it of Object.values(items)){
    const meta=await j(it.url+'?f=json');
    const layers=(meta&&(meta.layers||[]))||[];
    const lyList = layers.length?layers:[{id:(it.url.match(/\/(\d+)$/)||[])[1]||0,name:meta&&meta.name}];
    // revisar campos de la primera capa de polígonos
    let fieldsInfo=null;
    for(const ly of lyList.slice(0,3)){
      const lu=it.url.replace(/\/\d+$/,'')+'/'+ly.id;
      const lm=await j(lu+'?f=json');
      const flds=(lm&&lm.fields)||[];
      const valF=flds.filter(f=>/valor|unit|vut|vt|m2|precio|monto/i.test(f.name)).map(f=>f.name);
      const ahF=flds.filter(f=>/\bah\b|homog|area_h|cod.*ah|zona/i.test(f.name)).map(f=>f.name);
      const geom=lm&&lm.geometryType;
      const cnt=lm&&(lm.count!==undefined?lm.count:'?');
      if(valF.length||ahF.length||/Polygon/.test(geom||'')){
        fieldsInfo={layer:ly.id,name:lm&&lm.name,geom,valorFields:valF,ahFields:ahF,
          extent:lm&&lm.extent&&lm.extent.spatialReference,todos:flds.map(f=>f.name)};
        break;
      }
      await new Promise(z=>setTimeout(z,100));
    }
    report.push({title:it.title,owner:it.owner,type:it.type,url:it.url,found:fieldsInfo});
    const tag=fieldsInfo&&fieldsInfo.valorFields.length?'💰VALOR':(fieldsInfo?'poligonos':'—');
    console.log('  ',tag,'|',it.title,'| owner:',it.owner||'?','|',it.url);
    if(fieldsInfo&&fieldsInfo.valorFields.length) console.log('       campos valor:',fieldsInfo.valorFields.join(','),'| AH:',fieldsInfo.ahFields.join(','),'| campos:',fieldsInfo.todos.slice(0,20).join(','));
    await new Promise(z=>setTimeout(z,120));
  }
  const b=new Blob([JSON.stringify(report,null,1)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='probe_arcgis_ah.json'; document.body.appendChild(a); a.click(); a.remove();
  console.log('%cLISTO. Sube probe_arcgis_ah.json (y copia el resumen de arriba).','color:#0a0;font-weight:bold;font-size:14px');
})();
