// ============================================================================
//  SONDA PROCEDENCIA / FECHA DE DOMINIO — Catastro Bienes Nacionales
//  Corre en una pestaña de https://www.arcgis.com  (F12 -> Console -> pega -> Enter)
//  Lista TODOS los campos de los servicios de donde salieron los predios y
//  muestra VALORES de ejemplo, para ubicar "forma de adquisición" y "fecha".
//  Descarga probe_procedencia.json -> súbelo y copia el resumen de la consola.
// ============================================================================
(async () => {
  const j=async u=>{ try{const r=await fetch(u+(u.includes('?')?'&':'?')+'f=json');if(!r.ok){return{__http:r.status};}return await r.json();}catch(e){return{__err:String(e)};} };

  // Servicios/capas de donde ya salió el catastro (pre-codificados los acentos):
  const TARGETS=[
    {tag:'Propiedad_Fiscal_Administrada (RM/Valpo/Biobío)',
     url:'https://services2.arcgis.com/mQ0T5ijzGExuCc9o/arcgis/rest/services/Propiedad_Fiscal_Administrada/FeatureServer/0'},
    {tag:'Visor_PGIOT_Tarapacá (capa 39)',
     url:'https://services3.arcgis.com/cTnMkBRk4HWkUCRo/arcgis/rest/services/Visor_PGIOT_Regi%C3%B3n_de_Tarapac%C3%A1/FeatureServer/39'},
    {tag:'Base_de_Datos_Antofagasta (raíz -> capas)',
     url:'https://services6.arcgis.com/9yX8xdylSYIPqL3X/arcgis/rest/services/Base_de_Datos_Antofagasta_WFL1/FeatureServer'},
  ];

  // regex de campos que nos interesan
  const RXADQ=/adquis|proceden|origen|forma|dominio|titul|inscrip|decreto|foja|conservad|cbr|ingres|traspaso|herenc|expropi|donac|adjudic|regulariz|prescrip/i;
  const RXFECHA=/fecha|fech|f_|año|anio|ano_|year|dat|inscri|vigen/i;

  async function inspectLayer(url,tag){
    const m=await j(url);
    if(m.__err||m.__http){ console.warn('  ✗',tag,url,m); return {tag,url,error:m}; }
    const flds=(m.fields||[]).map(f=>({name:f.name,alias:f.alias,type:(f.type||'').replace('esriFieldType','')}));
    const hitAdq=flds.filter(f=>RXADQ.test(f.name)||RXADQ.test(f.alias||''));
    const hitFecha=flds.filter(f=>RXFECHA.test(f.name)||RXFECHA.test(f.alias||''));
    // muestra 3 features con TODOS los atributos
    const q=await j(url+'/query?where=1%3D1&outFields=*&returnGeometry=false&resultRecordCount=3');
    const samples=((q&&q.features)||[]).map(f=>f.attributes);
    console.log('%c▶ '+tag,'color:#09c;font-weight:bold','·',flds.length,'campos ·',(m.name||''));
    if(hitAdq.length) console.log('   %cADQUISICIÓN/PROCEDENCIA →','color:#0a0;font-weight:bold',hitAdq.map(f=>f.name+' ("'+(f.alias||'')+'")').join(' | '));
    if(hitFecha.length) console.log('   %cFECHA →','color:#c60;font-weight:bold',hitFecha.map(f=>f.name+' ("'+(f.alias||'')+'")').join(' | '));
    if(samples[0]){ // imprime valores de los campos candidatos
      const keys=[...new Set([...hitAdq,...hitFecha].map(f=>f.name))];
      console.log('   valores ejemplo:',keys.length?keys.map(k=>k+'='+JSON.stringify(samples[0][k])).join('  '):'(sin campos candidatos; revisa lista completa)');
    }
    return {tag,url,layerName:m.name,count:m.count,geom:m.geometryType,
            fields:flds, hitAdq:hitAdq.map(f=>f.name), hitFecha:hitFecha.map(f=>f.name), samples};
  }

  const rep=[];
  for(const t of TARGETS){
    const meta=await j(t.url);
    // si es raíz de FeatureServer (tiene .layers y no .fields) -> recorrer capas
    if(meta && meta.layers && !meta.fields){
      console.log('%c'+t.tag+' tiene '+meta.layers.length+' capas','color:#960;font-weight:bold');
      for(const ly of meta.layers){
        rep.push(await inspectLayer(t.url+'/'+ly.id, t.tag+' :: '+ly.id+' '+ly.name));
      }
    } else {
      rep.push(await inspectLayer(t.url, t.tag));
    }
  }
  const b=new Blob([JSON.stringify(rep,null,1)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='probe_procedencia.json';
  document.body.appendChild(a); a.click(); a.remove();
  console.log('%c[LISTO] Sube probe_procedencia.json y copia el resumen de arriba (campos ADQUISICIÓN y FECHA).','color:#0a0;font-weight:bold;font-size:14px');
})();
