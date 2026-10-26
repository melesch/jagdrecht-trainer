// Service Worker: alles vorab speichern, offline aus dem Cache liefern, online nach Updates schauen.
const VERSION='bbd39b4816';
const CACHE='jagdrecht-'+VERSION;
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return; // Google Fonts etc.: Browser-Standard
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{ if(r.ok){ caches.open(CACHE).then(c=>c.put(e.request,r.clone())); } return r; }).catch(()=>hit);
    return hit||net;
  }));
});
