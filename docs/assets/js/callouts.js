/**
 * Callout Transformation Script
 * Converts Markdown-style callouts (> [!TYPE]) to styled HTML
 * Compatible with GitHub callout syntax
 */

(function() {
  'use strict';

  // Callout configuration
  const CALLOUT_CONFIG = {
    'NOTE': { icon: 'ℹ️', title: 'Hinweis', className: 'note' },
    'INFO': { icon: 'ℹ️', title: 'Information', className: 'info' },
    'TIP': { icon: '💡', title: 'Tipp', className: 'tip' },
    'TIPP': { icon: '💡', title: 'Tipp', className: 'tipp' },
    'WARNING': { icon: '⚠️', title: 'Warnung', className: 'warning' },
    'CAUTION': { icon: '⚠️', title: 'Achtung', className: 'caution' },
    'DANGER': { icon: '🚫', title: 'Gefahr', className: 'danger' },
    'EXAMPLE': { icon: '📝', title: 'Beispiel', className: 'example' },
    'QUOTE': { icon: '💬', title: 'Zitat', className: 'quote' },
    'SUCCESS': { icon: '✅', title: 'Erfolg', className: 'success' },
    'QUESTION': { icon: '❓', title: 'Frage', className: 'question' },
    'FAILURE': { icon: '❌', title: 'Fehler', className: 'failure' },
    'BUG': { icon: '🐛', title: 'Bug', className: 'bug' }
  };

  /**
   * Transform a blockquote into a callout if it matches the pattern
   *
   * Callout-Struktur im Markdown:
   * > [!NOTE]                  <- Zeile 1: Titel-Zeile (nach erstem >)
   * > Details siehe Skript...  <- Zeile 2: Content-Zeile (nach zweitem >)
   *
   * Jekyll/kramdown wandelt dies um in:
   * <p>[!NOTE]<br>Details siehe Skript...</p>
   */
  function transformCallout(blockquote) {
    const firstParagraph = blockquote.querySelector('p');
    if (!firstParagraph) return;

    let text = firstParagraph.innerHTML.trim();

    // Match pattern: [!TYPE] at start
    const match = text.match(/^\[!(\w+)\]/);
    if (!match) return;

    const calloutType = match[1].toUpperCase();

    // Check if this callout type is configured
    if (!CALLOUT_CONFIG[calloutType]) {
      console.warn(`Unknown callout type: ${calloutType}`);
      return;
    }

    const config = CALLOUT_CONFIG[calloutType];
    let title = config.title;
    let contentHTML = '';

    // Remove [!TYPE] marker from text
    text = text.replace(/^\[!\w+\]/, '').trim();

    // Split at first <br> tag - this separates title line from content line
    const brMatch = text.match(/^(.*?)<br\s*\/?>\s*(.*)/is);

    if (brMatch) {
      // Format: [!TYPE] Optional Custom Title<br>Content
      const titlePart = brMatch[1].trim();
      const contentPart = brMatch[2].trim();

      // If titlePart is not empty, use it as custom title
      if (titlePart) {
        title = titlePart;
      }

      // contentPart always goes into content area
      if (contentPart) {
        contentHTML = '<p>' + contentPart + '</p>';
      }
    } else {
      // No <br> found - edge case (shouldn't happen in 2-line callouts)
      // Treat everything as content
      if (text) {
        contentHTML = '<p>' + text + '</p>';
      }
    }

    // Remove the first paragraph with [!TYPE]
    firstParagraph.remove();

    // Add remaining blockquote content if any
    const remainingHTML = blockquote.innerHTML.trim();
    if (remainingHTML) {
      contentHTML += remainingHTML;
    }

    // Create callout HTML structure
    const calloutHTML = `
      <div class="callout" data-callout="${config.className}">
        <div class="callout-title">
          <div class="callout-icon">${config.icon}</div>
          <div class="callout-title-inner">${title}</div>
        </div>
        <div class="callout-content">
          ${contentHTML}
        </div>
      </div>
    `;

    // Replace blockquote with callout
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = calloutHTML;
    const calloutElement = tempDiv.firstElementChild;

    blockquote.parentNode.replaceChild(calloutElement, blockquote);
  }

  /**
   * Process all blockquotes on the page
   */
  function processCallouts() {
    const blockquotes = document.querySelectorAll('blockquote');
    blockquotes.forEach(transformCallout);
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', processCallouts);
    } else {
      processCallouts();
    }
  }

  init();
})();
