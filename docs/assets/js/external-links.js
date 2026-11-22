// External Links - Open in new tab
// Automatisch alle externen Links mit target="_blank" versehen
(function() {
  function configureAgentLabLink() {
    // agent-lab.md wird über nav_order direkt nach dem Lernpfad einsortiert.
    // Der Menülink öffnet das Lab direkt; die Seite bleibt als Weiterleitung
    // für Aufrufe ohne JavaScript und gespeicherte Links erhalten.
    var labLink = document.querySelector('.site-nav a[href$="/agent-lab.html"]');
    if (!labLink) return;

    labLink.href = new URL('visualisierungen/agent_patterns_lab/#docs', labLink.href).href;
    labLink.target = '_blank';
    labLink.rel = 'noopener noreferrer';
    labLink.title = 'Begleitende Übungen zum aktuellen Kurskapitel (öffnet in neuem Tab)';
  }

  function processExternalLinks() {
    configureAgentLabLink();
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

  if (document.readyState !== 'loading') {
    processExternalLinks();
  } else {
    document.addEventListener('DOMContentLoaded', processExternalLinks, { once: true });
  }
})();
