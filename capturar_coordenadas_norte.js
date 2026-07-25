// Captura coordenadas (centroides) de los predios de Antofagasta y Tarapacá.
// Pega TODO en la consola del navegador (F12 -> Console). Descarga: centroides_norte.csv
(async () => {
  const SRC=[
    {region:"Antofagasta", base:"https://services6.arcgis.com/9yX8xdylSYIPqL3X/arcgis/rest/services/Base_de_Datos_Antofagasta_WFL1/FeatureServer", layer:null},
    {region:"Tarapacá",    base:"https://services3.arcgis.com/cTnMkBRk4HWkUCRo/arcgis/rest/services/Visor_PGIOT_Regi%C3%B3n_de_Tarapac%C3%A1/FeatureServer", layer:39},
  ];
  const J=u=>fetch(u).then(r=>r.json());
  const out=[];
  for(const s of SRC){
    let lid=s.layer;
    if(lid==null){ const m=await J(`${s.base}?f=json`);
      const L=(m.layers||[]).find(x=>/PROPIEDAD FISCAL ADMINISTRADA/i.test(x.name||""))||(m.layers||[])[0]; lid=L?L.id:0; }
    let off=0,n=0;
    while(true){
      const u=`${s.base}/${lid}/query?where=1%3D1&outFields=*&returnGeometry=false&returnCentroid=true&outSR=4326&resultOffset=${off}&resultRecordCount=1000&f=json`;
      const j=await J(u); const fs=j.features||[];
      for(const f of fs){
        const a=f.attributes||{}, c=f.centroid||{};
        const rolKey=Object.keys(a).find(k=>/ROL/i.test(k));
        const comKey=Object.keys(a).find(k=>/^COM$|COMUNA/i.test(k));
        out.push({REGION:s.region, ROL:(rolKey?a[rolKey]:'')||'SIN ROL',
          NOMBRE:a.NOMBRE||'', COMUNA:(comKey?a[comKey]:'')||'', LAT:c.y??'', LON:c.x??''});
        n++;
      }
      off+=fs.length; if(fs.length<1000) break;
    }
    console.log(`[${s.region}] ${n} registros`);
  }
  const cols=["REGION","ROL","NOMBRE","COMUNA","LAT","LON"];
  const esc=v=>`"${(v??'').toString().replace(/"/g,'""')}"`;
  const csv=[cols.join(";"),...out.map(r=>cols.map(c=>esc(r[c])).join(";"))].join("\n");
  const b=new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8;"}); const a=document.createElement("a");
  a.href=URL.createObjectURL(b); a.download="centroides_norte.csv"; a.click();
  console.log("LISTO:", out.length, "registros | con coordenada:", out.filter(x=>x.LAT!=='').length);
})();
