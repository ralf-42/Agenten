// External Links - Open in new tab
// Automatisch alle externen Links mit target="_blank" versehen
(function() {
  function processExternalLinks() {
    var links = document.querySelectorAll('a');
    var count = 0;

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.href;

      if (href && href.indexOf('http') === 0 && href.indexOf(window.location.hostname) === -1) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        count++;
      }
    }

    // Optional: Log nur in Development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[External Links] Processed: ' + count);
    }
  }

  if (document.readyState === 'complete') {
    processExternalLinks();
  } else {
    window.addEventListener('load', processExternalLinks);
  }
})();
