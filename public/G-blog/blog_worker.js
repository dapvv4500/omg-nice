const CACHE = "blog-cache-v1";
const ASSETS = [
  "../G-blog/admin.html",
  "../G-blog/index.html",
  "../G-blog/posts.html",
  "../G-blog/app.js",
  "../G-blog/blog_worker.js",
  "../G-blog/style.css",
  "../G-blog/manifest.json",
  "../G-blog/icon192.png",
  "../G-blog/icon512.png"
];

self.addEventListener("install", e => {
  // 
  console.log('======>>', e.request.url)
  if (e.request.url.endsWith("/backup/localStorage.json")) {    
    e.respondWith(          
    (async () => {            
      const db = await new Promise((resolve, reject) => {                
        const req = indexedDB.open("LocalStorageBackupDB", 1);              
        req.onsuccess = () => resolve(req.result);               
        req.onerror = () => reject(req.error);              
      });
            
      const tx = db.transaction("backups", "readonly");            
      const store = tx.objectStore("backups");            
      const record = await new Promise(resolve => {              
        const r = store.get("latest");                
        r.onsuccess = () => resolve(r.result);              
      });
            
      const body = record ? record.data : "{}";              
      return new Response(body, {              
        headers: { "Content-Type": "application/json" }              
      });
    }) ()        
    );
  } // This allows your app to request: ` /backup/localStorage.json `
    // And the service worker will return the latest auto‑backup, even offline.

  // catch assets files
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
