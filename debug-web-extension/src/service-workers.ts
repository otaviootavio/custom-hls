/// <reference lib="webworker" />

// src/service-worker.js or src/service-worker.ts
console.log('Service Worker Registered');

self.addEventListener('install', (_event) => {
  console.log('Service Worker Installed');
});

self.addEventListener('activate', (_event) => {
  console.log('Service Worker Activated');
});

self.addEventListener('fetch', (_event) => {
  console.log('Service Worker Fetched');
});
 