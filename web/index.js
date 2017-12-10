if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
    }, function(err) {
      // registration failed :(
      console.error('ServiceWorker registration failed: ', err); // eslint-disable-line no-console
    });
  });
}
