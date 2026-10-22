
(function () {
'use strict';
var d = document;
var fWA = d.getElementById('form-indica');
var WA = (fWA && fWA.getAttribute('data-wa')) || '551125381890';
var cards = [].slice.call(d.querySelectorAll('.prize'));
var PREMIOS = cards.map(function (c) { return { nome: c.getAttribute('data-nome'), pts: parseInt(c.getAttribute('data-pts'), 10) }; })
.sort(function (a, b) { return a.pts - b.pts; });
var fbtns = [].slice.call(d.querySelectorAll('.filters button'));
fbtns.forEach(function (b) {
b.addEventListener('click', function () {
var f = b.getAttribute('data-f');
fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
cards.forEach(function (c) {
var pts = parseInt(c.getAttribute('data-pts'), 10), cat = c.getAttribute('data-cat');
c.hidden = f === 'ate30' ? pts > 30 : (f !== 'todos' && cat !== f);
});
});
});
var ordem = d.getElementById('ordem'), lista = d.getElementById('prizes');
if (ordem && lista) {
ordem.addEventListener('change', function () {
var asc = ordem.value === 'asc';
cards.slice().sort(function (a, b) { var x = +a.getAttribute('data-pts'), y = +b.getAttribute('data-pts'); return asc ? x - y : y - x; })
.forEach(function (c) { lista.appendChild(c); });
});
}
var range = d.getElementById('sim-v');
if (range) {
var out = d.getElementById('sim-out'), elP = d.getElementById('sim-p'), elT = d.getElementById('sim-t'), elN = d.getElementById('sim-n'), list = d.getElementById('sim-list');
var mil = function (v) { return 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mil'; };
var li = function (cls, nome, txt) {
var el = d.createElement('li'); if (cls) el.className = cls;
var b = d.createElement('b'); b.textContent = nome;
var s = d.createElement('span'); s.textContent = txt;
el.appendChild(b); el.appendChild(s); return el;
};
var pinta = function () {
var v = parseInt(range.value, 10);
var pts = Math.round(v / 1000); /* até R$ 499 desce, de R$ 500 sobe */
var p = (v - range.min) / (range.max - range.min) * 100;
range.style.setProperty('--p', p + '%');
out.textContent = mil(v);
elP.textContent = pts;
var ok = PREMIOS.filter(function (x) { return x.pts <= pts; });
var prox = PREMIOS.filter(function (x) { return x.pts > pts; })[0];
elT.innerHTML = '';
var strong = d.createElement('strong');
if (ok.length) {
strong.textContent = ok.length === 1 ? '1 prêmio' : ok.length + ' prêmios';
elT.appendChild(d.createTextNode('Você já pode trocar por ')); elT.appendChild(strong); elT.appendChild(d.createTextNode('.'));
} else {
strong.textContent = 'Kindle Paperwhite';
elT.appendChild(d.createTextNode('Mais um pouco e você chega no ')); elT.appendChild(strong); elT.appendChild(d.createTextNode('.'));
}
elN.textContent = prox ? 'Próximo: ' + prox.nome + ', faltam ' + (prox.pts - pts) + ' pontos (' + mil((prox.pts - pts) * 1000) + ' em indicações).' : 'Você chegou ao topo do catálogo. Pode escolher qualquer prêmio.';
list.innerHTML = '';
ok.slice(-3).reverse().forEach(function (x) { list.appendChild(li('ok', x.nome, x.pts + ' pts · liberado')); });
if (prox) list.appendChild(li('next', prox.nome, prox.pts + ' pts'));
};
range.addEventListener('input', pinta);
d.querySelectorAll('.presets button').forEach(function (b) {
b.addEventListener('click', function () { range.value = b.getAttribute('data-v'); pinta(); });
});
pinta();
}
var form = d.getElementById('form-indica');
if (form) {
var soDig = function (s) { return s.replace(/\D/g, ''); };
form.addEventListener('submit', function (e) {
e.preventDefault();
var msg = d.getElementById('form-msg');
msg.classList.remove('ok');
var campos = [
[form.inome, 'Escreva o seu nome.'],
[form.itel, 'Escreva o seu WhatsApp com DDD.', 10],
[form.anome, 'Escreva o nome do seu amigo.'],
[form.atel, 'Escreva o WhatsApp do seu amigo com DDD.', 10]
];
for (var i = 0; i < campos.length; i++) {
var c = campos[i], v = c[0].value.trim();
if (!v || (c[2] && soDig(v).length < c[2])) { msg.textContent = c[1]; c[0].focus(); return; }
}
if (!form.ok.checked) { msg.textContent = 'Confirme que o seu amigo sabe da indicação.'; form.ok.focus(); return; }
var loja = (form.querySelector('input[name="loja"]:checked') || {}).value || '';
var amb = [].slice.call(form.querySelectorAll('input[name="amb"]:checked')).map(function (x) { return x.value; });
var linhas = [
'Olá! Quero indicar um amigo no Vorani Indica.',
'',
'Meu nome: ' + form.inome.value.trim(),
'Meu WhatsApp: ' + form.itel.value.trim(),
'',
'Amigo indicado: ' + form.anome.value.trim(),
'WhatsApp do amigo: ' + form.atel.value.trim()
];
if (amb.length) linhas.push('Quer planejar: ' + amb.join(', '));
if (loja) linhas.push('Loja mais perto: ' + loja);
if (form.amsg.value.trim()) linhas.push('Observação: ' + form.amsg.value.trim());
linhas.push('', 'Ele já sabe que estou indicando.');
var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(linhas.join('\n'));
msg.textContent = 'Abrindo o WhatsApp…'; msg.classList.add('ok');
var a = d.createElement('a');
a.href = url; a.target = '_blank'; a.rel = 'noopener';
d.body.appendChild(a); a.click(); a.remove();
});
}
})();
