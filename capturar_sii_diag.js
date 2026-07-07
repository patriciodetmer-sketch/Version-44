// DIAGNÓSTICO GetFeatureInfo SII — prueba variantes en 1 punto conocido (Teatinos, Santiago).
// Pega en la consola de https://www4.sii.cl/mapasui/internet/  y copia TODO el log al chat.
(async () => {
  const lon=-70.65322, lat=-33.43812, code=13101;   // id 2, AH esperado CMM013
  const R=6378137,D=Math.PI/180;
  const x=lon*R*D, y=Math.log(Math.tan((90+lat)*D/2))*R, h=50;
  const bbox=[x-h,y-h,x+h,y+h].join(',');
  const LY='sii:BR_CART_AH_MUESTRAS', ST='AH_MUESTRA_EAC_14_2022';
  const q=o=>Object.entries(o).map(([k,v])=>k+'='+encodeURIComponent(v)).join('&');
  const B='https://www4.sii.cl/mapasui/services/ui/wmsProxyService/';
  const variants=[
    ['A callComuna GFI 1.1.1', B+'callComuna?'+q({service:'WMS',version:'1.1.1',request:'GetFeatureInfo',layers:LY,query_layers:LY,styles:ST,comuna:code,eac:14,eacano:2022,srs:'EPSG:3857',bbox,width:101,height:101,x:50,y:50,format:'image/png',info_format:'application/json',feature_count:8})],
    ['B callComuna GFI 1.3.0', B+'callComuna?'+q({service:'WMS',version:'1.3.0',request:'GetFeatureInfo',layers:LY,query_layers:LY,styles:ST,comuna:code,eac:14,eacano:2022,crs:'EPSG:3857',bbox,width:101,height:101,i:50,j:50,format:'image/png',info_format:'application/json',feature_count:8})],
    ['C call GFI 1.1.1', B+'call?'+q({service:'WMS',version:'1.1.1',request:'GetFeatureInfo',layers:LY,query_layers:LY,styles:ST,comuna:code,eac:14,eacano:2022,srs:'EPSG:3857',bbox,width:101,height:101,x:50,y:50,format:'image/png',info_format:'application/json',feature_count:8})],
    ['D callComuna GFI text/plain', B+'callComuna?'+q({service:'WMS',version:'1.1.1',request:'GetFeatureInfo',layers:LY,query_layers:LY,styles:ST,comuna:code,eac:14,eacano:2022,srs:'EPSG:3857',bbox,width:101,height:101,x:50,y:50,format:'image/png',info_format:'text/plain',feature_count:8})],
    ['E callComuna GetMap (sanity)', B+'callComuna?'+q({service:'WMS',version:'1.1.1',request:'GetMap',layers:LY,styles:ST,comuna:code,eac:14,eacano:2022,srs:'EPSG:3857',bbox,width:101,height:101,format:'image/png',transparent:true})],
  ];
  for(const [name,u] of variants){
    try{
      const r=await fetch(u,{headers:{'Accept':'*/*'}});
      const ct=r.headers.get('content-type')||'';
      let body='';
      if(ct.includes('image')){ body='[imagen '+ct+']'; }
      else { body=(await r.text()).slice(0,500); }
      console.log('=== '+name+' | HTTP '+r.status+' | '+ct+'\n'+body+'\n');
    }catch(e){ console.log('=== '+name+' | ERROR '+e.message+'\n'); }
    await new Promise(z=>setTimeout(z,300));
  }
  console.log('FIN DIAGNÓSTICO — copia todo y pégalo al chat.');
})();
