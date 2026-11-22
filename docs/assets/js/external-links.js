// External Links - Open in new tab
// Automatisch alle externen Links mit target="_blank" versehen
(function() {
  function positionAgentLabLink() {
    // Das Theme hängt externe Einträge ans Menüende. Das kursbegleitende Lab
    // steht stattdessen direkt nach dem Lernpfad, ohne zusätzliche Inhaltsseite.
    var labLink = document.querySelector('.site-nav a[href$="/visualisierungen/agent_patterns_lab/#docs"]');
    if (!labLink) return;

    labLink.target = '_blank';
    labLink.rel = 'noopener noreferrer';
    labLink.title = 'Begleitende Übungen zum aktuellen Kurskapitel (öffnet in neuem Tab)';

    var learningPathLink = document.querySelector('.site-nav a[href$="/lernpfad.html"]');
    var labItem = labLink.closest('li');
    var learningPathItem = learningPathLink && learningPathLink.closest('li');
    if (labItem && learningPathItem) {
      learningPathItem.parentNode.insertBefore(labItem, learningPathItem.nextSibling);
    }
  }

  function processExternalLinks() {
    positionAgentLabLink();
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
