// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then(function() {
        console.log("Pendaftaran ServiceWorker berhasil");
        })
        .catch(function() {
        console.log("Pendaftaran ServiceWorker gagal");
        });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

// Periksa fitur Notification API
if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
        if (result === "denied") {
          console.log("Si dia gak mau dikasih tau.");
          return;
        } else if (result === "default") {
          console.error("Dikacangin ama si dia.");
          return;
        }
        
        if (('PushManager' in window)) {
            navigator.serviceWorker.getRegistration().then(function(registration) {
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BCC8lrumBcnYRgG-dAw1V0lMNPcDL7sse3140DFLjfruOIYLnxjO6JOBC6L0YtorkKwFQ8dAx1BLFQsMT2RMljY"),
                }).then(function(subscribe) {
                    console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                    console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('p256dh')))));
                    console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('auth')))));
                }).catch(function(e) {
                    console.error('Tidak dapat melakukan subscribe ', e.message);
                });
            });
        }
      });
} else {
    console.error("Browser tidak mendukung notifikasi.");
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// REQUEST API UNTUK PERTAMA KALI
document.addEventListener("DOMContentLoaded", function() {
    getClub();
});