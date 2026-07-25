// PASO 1 — DESCUBRIMIENTO DE ENDPOINTS DE SII MAPAS
// 1) Abre https://www4.sii.cl/mapasui/internet/  (espera a que cargue el mapa)
// 2) F12 -> Console -> pega TODO este script -> Enter  (dira "Espia activo")
// 3) USA EL VISOR NORMALMENTE: busca una direccion (ej. "Teatinos 120, Santiago"),
//    haz clic en un predio, abre su ficha/avaluo, mira el valor de area homogenea.
//    Haz 2-3 consultas distintas.
// 4) Vuelve a la consola y escribe:  exportarLog()   -> descarga sii_endpoints.json
// 5) Sube ese archivo al chat.
(() => {
  if (window.__SII_SPY) { console.log('El espia ya estaba activo.'); return; }
  window.__SII_SPY = true;
  const LOG = window.__SII_LOG = [];
  const keep = u => typeof u === 'string' && /sii\.cl/i.test(u) && !/\.(png|jpg|gif|css|js|woff|svg|ico)(\?|$)/i.test(u);
  const snip = t => { try { return String(t).slice(0, 1200); } catch(e){ return ''; } };
  const add = (via, method, url, status, body) => {
    LOG.push({via, method, url, status, resp: snip(body), t: new Date().toISOString()});
    console.log('%c[SII-SPY]','color:#0a7', method, status, url.slice(0,140));
  };
  // fetch
  const of = window.fetch;
  window.fetch = async function(input, init){
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const res = await of.apply(this, arguments);
    if (keep(url)) { try { const c = res.clone(); const tx = await c.text(); add('fetch', (init&&init.method)||'GET', url, res.status, tx); } catch(e){} }
    return res;
  };
  // XHR
  const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(m, u){ this.__m=m; this.__u=u; return oo.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function(){
    this.addEventListener('load', () => { if (keep(this.__u)) add('xhr', this.__m, this.__u, this.status, this.responseText); });
    return os.apply(this, arguments);
  };
  window.exportarLog = () => {
    const b = new Blob([JSON.stringify(LOG, null, 1)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(b);
    a.download = 'sii_endpoints.json'; a.click();
    console.log('Exportado:', LOG.length, 'llamadas registradas.');
  };
  console.log('%cEspia activo. Usa el visor (busca direccion, clic en predio, ver avaluo) y luego escribe: exportarLog()','color:#fff;background:#0a7;padding:3px 8px;border-radius:4px');
})();
