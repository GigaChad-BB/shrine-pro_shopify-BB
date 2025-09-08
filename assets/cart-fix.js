// assets/cart-fix.js
(function () {
  function getLine(el) {
    const li = el.closest('[data-index]');
    if (!li) return null;
    const line = parseInt(li.getAttribute('data-index'), 10);
    return isNaN(line) ? null : line;
  }

  async function setQtyByLine(line, qty) {
    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ line, quantity: Math.max(0, qty|0) })
      });
    } catch (e) {
      console.error('cart/change.js failed', e);
    }
    // Recharge l’affichage (totaux + items)
    location.reload();
  }

  // Clic sur + / −
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-qty]');
    if (!btn) return;

    const line = getLine(btn);
    if (!line) return;

    const container = btn.closest('[data-index]');
    const input = container?.querySelector('input[type="number"]');
    const current = parseInt(input?.value || '1', 10);
    const next = btn.dataset.qty === 'inc' ? current + 1 : Math.max(0, current - 1);

    if (input) input.value = next; // feedback visuel

    setQtyByLine(line, next);
  });

  // Saisie directe dans l’input
  document.addEventListener('change', (e) => {
    const input = e.target.closest('input[type="number"]');
    if (!input) return;

    const line = getLine(input);
    if (!line) return;

    const qty = parseInt(input.value || '0', 10);
    setQtyByLine(line, qty);
  });

  // Clic sur poubelle / bouton supprimer
  document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-cart-remove], .cart-remove, .cart-item__remove, a[href*="quantity=0"]');
    if (!removeBtn) return;

    e.preventDefault();

    const line = getLine(removeBtn);
    if (!line) return;

    // Forcer la ligne à 0 (suppression)
    setQtyByLine(line, 0);
  });
})();
