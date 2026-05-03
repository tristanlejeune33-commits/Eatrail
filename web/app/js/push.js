/* eatrail · Web Push subscription helper
 *
 * Usage:
 *   const status = await eat.push.status();    // 'unsupported' | 'denied' | 'granted' | 'default'
 *   const ok = await eat.push.enable();        // requests permission + subscribes
 *   await eat.push.disable();                  // unsubscribe
 */
(function () {
  const eat = (window.eat = window.eat || {});

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  }

  eat.push = {
    isSupported: () => 'serviceWorker' in navigator && 'PushManager' in window,

    /** Returns: 'unsupported' | 'denied' | 'granted' | 'default' */
    async status() {
      if (!eat.push.isSupported()) return 'unsupported';
      return Notification.permission;
    },

    async getSubscription() {
      if (!eat.push.isSupported()) return null;
      const reg = await navigator.serviceWorker.ready;
      return reg.pushManager.getSubscription();
    },

    async enable() {
      if (!eat.push.isSupported()) {
        throw new Error('Push notifications non supportées sur ce navigateur.');
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission refusée.');
      }

      // Fetch VAPID public key
      const { publicKey } = await eat.api.push.publicKey();
      if (!publicKey) throw new Error('Push non configuré côté serveur.');

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      // Register with backend
      await eat.api.push.subscribe({
        endpoint: sub.endpoint,
        keys: { p256dh: arrayBufferToBase64(sub.getKey('p256dh')), auth: arrayBufferToBase64(sub.getKey('auth')) },
      });
      return true;
    },

    async disable() {
      const sub = await eat.push.getSubscription();
      if (!sub) return false;
      await sub.unsubscribe();
      try { await eat.api.push.unsubscribe(sub.endpoint); } catch {}
      return true;
    },

    async test() {
      return eat.api.push.test();
    },
  };

  function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }
})();
