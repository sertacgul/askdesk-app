const CACHE_NAME = 'askdesk-v2-9-12-cache';

const ASSETS_TO_CACHE = [

  './',

  './index.html',

  './manifest.json',

  // Dış Kütüphaneler (CDN) - Offline çalışması için

  'https://cdn.tailwindcss.com',

  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',

  'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js',

  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',

  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',

  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'

];

// Kurulum: Dosyaları Önbelleğe Al

self.addEventListener('install', (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME).then((cache) => {

      console.log('[Service Worker] Caching all assets');

      return cache.addAll(ASSETS_TO_CACHE);

    })

  );

});

// Aktifleşme: Eski Önbellekleri Temizle

self.addEventListener('activate', (event) => {

  event.waitUntil(

    caches.keys().then((keyList) => {

      return Promise.all(

        keyList.map((key) => {

          if (key !== CACHE_NAME) {

            console.log('[Service Worker] Removing old cache', key);

            return caches.delete(key);

          }

        })

      );

    })

  );

  return self.clients.claim();

});

// İstekleri Yakala: Önce Cache, Yoksa Network

self.addEventListener('fetch', (event) => {

  // Data URL'leri veya API isteklerini cache'leme (Worker API hariç)

  if (event.request.url.includes('data:') || event.request.method === 'POST') {

    return; 

  }

  event.respondWith(

    caches.match(event.request).then((response) => {

      // Cache'de varsa döndür, yoksa fetch et

      return response || fetch(event.request).catch(() => {

        // Eğer hem cache hem network yoksa ve HTML isteniyorsa (Offline sayfası eklenebilir)

        // Şimdilik sessiz kalıyoruz.

      });

    })

  );

});
 
