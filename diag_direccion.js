// DIAGNÓSTICO getPrediosDireccion — 3 direcciones conocidas. Muestra la respuesta cruda.
// Pega en la consola de https://www4.sii.cl/mapasui/internet/  y copia el log al chat.
(async () => {
  const NS='cl.sii.sdi.lob.bbrr.mapas.data.api.interfaces.MapasFacadeService/';
  const BASE='https://www4.sii.cl/mapasui/services/data/mapasFacadeService/';
  const rid=()=>(crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now());
  const casos=[
    {c:'13101',nom:'SANTIAGO',calle:'teatinos',num:'120'},
    {c:'13101',nom:'SANTIAGO',calle:'agustinas',num:'1269'},
    {c:'15108',nom:'LAS CONDES',calle:'apoquindo',num:'3000'},
  ];
  for(const k of casos){
    const body={metaData:{namespace:NS+'getPrediosDireccion',conversationId:'UNAUTHENTICATED-CALL',transactionId:rid()},
      data:{rolDireccion:{comuna:k.c,nombreComuna:k.nom,calle:k.calle,numeroCalleStr:k.num,detalle:0},
        servicios:[{comuna:Number(k.c),layer:'sii:BR_CART_AH_MUESTRAS',style:'AH_MUESTRA_EAC_14_2022',eac:14,eacano:2022}]}};
    try{
      const r=await fetch(BASE+'getPrediosDireccion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const txt=await r.text();
      console.log('=== '+k.calle+' '+k.num+' ('+k.nom+') | HTTP '+r.status+'\n'+txt.slice(0,700)+'\n');
    }catch(e){ console.log('=== '+k.calle+' | ERROR '+e.message); }
    await new Promise(z=>setTimeout(z,500));
  }
  console.log('FIN — copia todo al chat.');
})();
