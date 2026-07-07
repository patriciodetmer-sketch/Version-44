// SONDA DE COBERTURA — cuenta features y comunas de las capas AH-SII con valor.
// Corre en una pestaña de arcgis.com. F12 -> Console -> pega -> Enter.
// Descarga probe_cobertura.json y muestra resumen.
(async () => {
  const j=async u=>{ try{const r=await fetch(u,{headers:{'Accept':'application/json'}});return await r.json();}catch(e){return {error:String(e)};} };
  const LAYERS=[
    {t:'Predios_y_AH_SII', url:'https://services6.arcgis.com/7he6XdQyT8BzSLMa/arcgis/rest/services/Predios_y_%C3%81reas_Homog%C3%A9neas_SII/FeatureServer/0', com:'NOM_COMUNA', val:'VALOR_BASE'},
    {t:'Catastro_Mercado_Suelo', url:'https://services6.arcgis.com/7he6XdQyT8BzSLMa/arcgis/rest/services/Catastro_Mercado_de_Suelo_2023_05_05/FeatureServer/0', com:'COMUNA_', val:'VALOR_BASE'},
    {t:'areas_homogeneas_sii_TerrenoIII', url:'https://services2.arcgis.com/cRH3tEMPESJz6DMX/arcgis/rest/services/areas_homogeneas_sii/FeatureServer/0', com:'NOM_COMUNA', val:'VALOR_BASE'},
    {t:'Areas_homogeneas_CBR_pts', url:'https://services6.arcgis.com/7he6XdQyT8BzSLMa/arcgis/rest/services/Areas_homogeneas/FeatureServer/0', com:'COMUNA', val:'Valor_base_avaluo_fiscal'},
    {t:'Predios_Alt_PRC_SII', url:'https://services6.arcgis.com/7he6XdQyT8BzSLMa/arcgis/rest/services/Predios_Alt_PRC_SII/FeatureServer/0', com:'', val:'SII_valorU'},
  ];
  const out=[];
  for(const L of LAYERS){
    const cnt=await j(L.url+'/query?where=1%3D1&returnCountOnly=true&f=json');
    const ext=await j(L.url+'?f=json');
    let comunas=null;
    if(L.com){
      const st=encodeURIComponent(JSON.stringify([{statisticType:'count',onStatisticField:'OBJECTID',outStatisticFieldName:'n'}]));
      const g=await j(L.url+'/query?where=1%3D1&groupByFieldsForStatistics='+L.com+'&outStatistics='+st+'&f=json&resultRecordCount=1000');
      comunas=(g&&g.features)?g.features.map(f=>f.attributes).filter(a=>a[L.com]!=null):null;
    }
    // muestra de valores
    const smp=await j(L.url+'/query?where='+encodeURIComponent(L.val+'>0')+'&outFields='+L.val+(L.com?','+L.com:'')+'&resultRecordCount=5&f=json');
    const sample=(smp&&smp.features)?smp.features.map(f=>f.attributes):null;
    const rec={layer:L.t,url:L.url,count:cnt&&cnt.count,geom:ext&&ext.geometryType,
      nComunas:comunas?comunas.length:null,
      comunas:comunas?comunas.map(a=>a[L.com]).sort():null, sample};
    out.push(rec);
    console.log('%c'+L.t,'font-weight:bold','| features:',rec.count,'| comunas:',rec.nComunas,'| geom:',rec.geom);
    if(rec.comunas) console.log('   comunas:',rec.comunas.join(', '));
    if(sample) console.log('   muestra valor:',JSON.stringify(sample));
  }
  const b=new Blob([JSON.stringify(out,null,1)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='probe_cobertura.json'; document.body.appendChild(a); a.click(); a.remove();
  console.log('%cLISTO. Sube probe_cobertura.json','color:#0a0;font-weight:bold;font-size:14px');
})();
