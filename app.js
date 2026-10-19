
(function () {
'use strict';
var d = document, w = window;
var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var WA = '551125381890';
var nav = d.querySelector('.nav'), toggle = d.querySelector('.nav-toggle');
function setMenu(open) {
nav.classList.toggle('open', open);
toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
d.querySelectorAll('.nav-list a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });
var ticking = false;
w.addEventListener('scroll', function () {
if (ticking) return; ticking = true;
w.requestAnimationFrame(function () { nav.classList.toggle('scrolled', w.scrollY > 8); ticking = false; });
}, { passive: true });
var fmt = function (n, dec) { return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
function countUp(el) {
var tn = el.firstChild; if (!tn || tn.nodeType !== 3) return;
var m = tn.nodeValue.match(/^(\D*)([\d.,]+)(.*)$/); if (!m) return;
var target = parseFloat(el.getAttribute('data-count'));
var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
var t0 = null, dur = 1600;
function step(t) {
if (!t0) t0 = t;
var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
tn.nodeValue = m[1] + fmt(target * e, dec) + m[3];
if (p < 1) w.requestAnimationFrame(step); else tn.nodeValue = m[1] + m[2] + m[3];
}
w.requestAnimationFrame(step);
}
if ('IntersectionObserver' in w && !reduce) {
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
if (!en.isIntersecting) return;
var el = en.target;
el.classList.add('in'); el.classList.remove('pre');
el.querySelectorAll('[data-count]').forEach(countUp);
if (el.hasAttribute('data-count')) countUp(el);
io.unobserve(el);
});
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
d.querySelectorAll('.rv').forEach(function (el) {
if (el.getBoundingClientRect().top > w.innerHeight * 0.92) { el.classList.add('pre'); io.observe(el); }
});
}
var tiles = [].slice.call(d.querySelectorAll('.tile'));
d.querySelectorAll('.filters button').forEach(function (b) {
b.addEventListener('click', function () {
var f = b.getAttribute('data-f');
d.querySelectorAll('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
tiles.forEach(function (t) { t.hidden = !(f === 'todos' || t.getAttribute('data-cat') === f); });
});
});
var lb = d.getElementById('lb');
if (lb && typeof lb.showModal === 'function') {
var src = lb.querySelector('source'), img = lb.querySelector('img'), cap = d.getElementById('lb-cap'), cur = 0;
var visible = function () { return tiles.filter(function (t) { return !t.hidden; }); };
var set = function (t) {
var k = t.getAttribute('data-key'), ws = t.getAttribute('data-widths').split(',');
src.srcset = ws.map(function (x) { return 'img/' + k + '-' + x + '.avif ' + x + 'w'; }).join(', ');
img.srcset = ws.map(function (x) { return 'img/' + k + '-' + x + '.webp ' + x + 'w'; }).join(', ');
src.sizes = img.sizes = '100vw';
img.src = 'img/' + k + '-' + ws[ws.length - 1] + '.webp';
img.alt = t.querySelector('img').alt;
cap.textContent = t.querySelector('.cap').textContent;
};
var go = function (dir) { var v = visible(); cur = (cur + dir + v.length) % v.length; set(v[cur]); };
tiles.forEach(function (t) {
t.addEventListener('click', function () { var v = visible(); cur = v.indexOf(t); set(t); lb.showModal(); });
});
lb.querySelector('.lb-x').addEventListener('click', function () { lb.close(); });
lb.querySelector('.lb-prev').addEventListener('click', function () { go(-1); });
lb.querySelector('.lb-next').addEventListener('click', function () { go(1); });
lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-in')) lb.close(); });
lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
var x0 = null;
lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); x0 = null; });
}
var form = d.getElementById('form-orcamento');
if (form) {
form.addEventListener('submit', function (e) {
e.preventDefault();
var msg = d.getElementById('form-msg');
var nome = form.nome.value.trim();
if (!nome) { msg.textContent = 'Escreva seu nome para a gente saber com quem vai falar.'; form.nome.focus(); return; }
var amb = [].slice.call(form.querySelectorAll('input[name="amb"]:checked')).map(function (i) { return i.value; });
var linhas = ['Olá! Meu nome é ' + nome + '.', 'Quero um orçamento de móveis planejados na Vorani Conceito.'];
if (amb.length) linhas.push('Ambientes: ' + amb.join(', ') + '.');
if (form.bairro.value.trim()) linhas.push('Bairro/cidade: ' + form.bairro.value.trim() + '.');
if (form.msg.value.trim()) linhas.push('Sobre o espaço: ' + form.msg.value.trim());
var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(linhas.join('\n'));
msg.textContent = 'Abrindo o WhatsApp…';
var a = d.createElement('a');
a.href = url; a.target = '_blank'; a.rel = 'noopener';
d.body.appendChild(a); a.click(); a.remove();
});
}
})();
