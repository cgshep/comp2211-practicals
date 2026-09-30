'use strict';
document.documentElement.classList.add('js');
const boxes = Array.from(document.querySelectorAll('[data-step]'));
const storageKey = 'comp2211-week1-python-v4';
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) boxes.forEach(box => { box.checked = saved.includes(box.dataset.step); });
  localStorage.setItem(storageKey, JSON.stringify(boxes.filter(b => b.checked).map(b => b.dataset.step)));
} catch (_) {
  storageAvailable = false;
  document.querySelector('#storage-note').textContent = 'Ticks last for this visit; browser storage is unavailable.';
}
function updateProgress() {
  const selected = boxes.filter(box => box.checked).map(box => box.dataset.step);
  document.querySelector('#progress').value = selected.length;
  document.querySelector('#progress-label').textContent = `${selected.length} of 7 parts complete`;
  if (storageAvailable) {
    try { localStorage.setItem(storageKey, JSON.stringify(selected)); }
    catch (_) {
      storageAvailable = false;
      document.querySelector('#storage-note').textContent = 'Ticks last for this visit; browser storage is unavailable.';
    }
  }
}
boxes.forEach(box => box.addEventListener('change', updateProgress));
document.querySelector('#reset').addEventListener('click', () => {
  boxes.forEach(box => { box.checked = false; });
  updateProgress();
});
updateProgress();

async function copyCode(button) {
  const code = button.closest('.codebox').querySelector('code');
  try {
    await navigator.clipboard.writeText(code.textContent);
    button.textContent = 'Copied';
    document.querySelector('#copy-status').textContent = 'Code copied.';
    setTimeout(() => { button.textContent = 'Copy'; }, 1500);
  } catch (_) {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.querySelector('#copy-status').textContent = 'Code selected. Press Ctrl+C or Command+C to copy.';
    button.textContent = 'Selected';
    setTimeout(() => { button.textContent = 'Copy'; }, 2500);
  }
}
document.querySelectorAll('.copy').forEach(button => button.addEventListener('click', () => copyCode(button)));

// Open hints for printing, then restore the reader's view.
let openBeforePrint = [];
window.addEventListener('beforeprint', () => {
  openBeforePrint = Array.from(document.querySelectorAll('details')).filter(el => el.open);
  document.querySelectorAll('details').forEach(el => { el.open = true; });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach(el => { el.open = openBeforePrint.includes(el); });
});
document.querySelector('#print').addEventListener('click', () => window.print());

if ('IntersectionObserver' in window) {
  const nav = Array.from(document.querySelectorAll('.toc ol a'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.forEach(a => {
          if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-5% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('[id^="part"]').forEach(el => observer.observe(el));
}
