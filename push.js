var webPush = require('web-push');
     
const vapidKeys = {
   "publicKey": "BCC8lrumBcnYRgG-dAw1V0lMNPcDL7sse3140DFLjfruOIYLnxjO6JOBC6L0YtorkKwFQ8dAx1BLFQsMT2RMljY",
   "privateKey": "fGJYycesKw2Gim7AvkuHXU2vj2PBzOcNWi9J0W01KHY"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/eqbVgez1jOk:APA91bH8N313K8a8AWGfobEiKvumJtPfDQCx0g3NbyEvNrbRXpUt19DgSElqSdOGYxIOdetkdVKEoJUQvBkwVnj937tk2xfr5MkpA_X-BFTzYciKoi6AfGb9ntMeQJ2cA-QFIbIwd13z",
   "keys": {
       "p256dh": "BL7P5UCtturGVKiGhqnuV9h25wO0D0yOfr2LP1QiJyIaUIeqz8V5pE/jE7wFP75shZ1VSz9/D4Yd2G3GdHFX3l0=",
       "auth": "HJxKevQEERc0HqfZZxMJOQ=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '50929837500',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);