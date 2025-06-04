// Import Firebase scripts (these versions might need updating based on your Firebase SDK version)
try {
  importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');
} catch (e) {
  console.error('Error importing Firebase scripts in Service Worker:', e);
}


// IMPORTANT: Replace with your Firebase project's configuration
// It's recommended to manage this configuration securely, potentially by having your server
// provide it or by using a build process to inject it.
// For demonstration, placeholders are used.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual config
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your actual config
  projectId: "YOUR_PROJECT_ID", // Replace with your actual config
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your actual config
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual config
  appId: "YOUR_APP_ID" // Replace with your actual config
  // measurementId is optional
};

if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.error('Error initializing Firebase app in Service Worker:', e);
  }
} else if (typeof firebase === 'undefined') {
  console.error('Firebase scripts not loaded in Service Worker.');
}

let messaging;
if (typeof firebase !== 'undefined' && typeof firebase.messaging === 'function') {
  try {
    messaging = firebase.messaging();
  } catch(e) {
    console.error('Error getting Firebase messaging instance in Service Worker:', e);
  }
} else {
   console.error('Firebase messaging not available in Service Worker.');
}

if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message: ',
      payload
    );

    // Customize notification here
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new message.',
      icon: payload.notification?.icon || '/icons/icon-192x192.png', // Provide a default icon
      data: payload.data // Pass along any data for when notification is clicked
    };

    // Ensure self.registration is available (it should be in a service worker context)
    if (self.registration) {
      self.registration.showNotification(notificationTitle, notificationOptions)
        .catch(err => console.error("Error showing notification: ", err));
    } else {
      console.error("self.registration is not available. Cannot show notification.");
    }
  });
}

// Optional: Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event.notification);
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard'; // Default to dashboard or use URL from payload data

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if a window/tab with the target URL is already open.
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        // If a window/tab matching the targeted URL already exists, focus it.
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
