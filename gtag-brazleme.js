
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'AW-798180575');
var CONV_FORM_BRAZLEME = 'AW-798180575/AyZlCI_8t7odEN-JzfwC';
// Envio do formulário Kommo da página (aviso "amoformsSuccessSubmit" que o formulário manda à página)
(function () {
var contou = false;
window.addEventListener('message', function (e) {
if (contou || e.origin !== 'https://forms.kommo.com') return;
var d; try { d = JSON.parse(e.data); } catch (x) { return; }
if (!d || d.func !== 'amoformsSuccessSubmit') return;
contou = true;
gtag('event', 'conversion', { send_to: CONV_FORM_BRAZLEME });
});
})();
