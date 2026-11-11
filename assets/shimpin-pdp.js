(function () {
  function isHeading(n) {
    if (n.nodeType !== 1) return false;
    if (/^H[1-4]$/.test(n.tagName)) return true;
    // <p><strong>Key Features</strong></p> style headings
    if (n.tagName === 'P' && n.children.length === 1 &&
        /^(STRONG|B)$/.test(n.children[0].tagName)) {
      var t = n.textContent.trim();
      return t === n.children[0].textContent.trim() && t.length < 40 && t.indexOf(':') === -1;
    }
    return false;
  }

  function splitDescription() {
    var desc = document.querySelector('.product__info-container .product__description');
    if (!desc) return;
    var host = desc.closest('.product__accordion');
    if (!host) return;

    var groups = [{ title: 'Description', nodes: [] }];
    Array.prototype.slice.call(desc.childNodes).forEach(function (node) {
      if (isHeading(node)) {
        groups.push({ title: node.textContent.trim(), nodes: [] });
      } else {
        groups[groups.length - 1].nodes.push(node);
      }
    });
    groups = groups.filter(function (g) {
      return g.nodes.some(function (n) { return (n.textContent || '').trim() !== ''; });
    });
    if (groups.length < 2) return;

    var caret = host.querySelector('summary .icon-caret');
    var frag = document.createDocumentFragment();

    groups.forEach(function (g, i) {
      var wrap = document.createElement('div');
      wrap.className = 'product__accordion accordion quick-add-hidden';
      var details = document.createElement('details');
      if (i === 0) details.open = true;

      var summary = document.createElement('summary');
      summary.innerHTML = '<div class="summary__title"><h2 class="h4 accordion__title"></h2></div>';
      summary.querySelector('.accordion__title').textContent = g.title;
      if (caret) summary.appendChild(caret.cloneNode(true));

      var content = document.createElement('div');
      content.className = 'accordion__content rte shimpin-rte';
      g.nodes.forEach(function (n) { content.appendChild(n); });

      details.appendChild(summary);
      details.appendChild(content);
      wrap.appendChild(details);
      frag.appendChild(wrap);
    });

    host.parentNode.replaceChild(frag, host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', splitDescription);
  } else {
    splitDescription();
  }
})();