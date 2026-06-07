/**
 * app.js — Controller UI
 * ChaCha20 Web App · Universitas Maritim Raja Ali Haji 2025/2026
 */
"use strict";

// ── Tab Switching dengan sinkronisasi key & nonce ──
function switchTab(tab) {
  if (tab === 'dec') {
    const k = document.getElementById('keyInputEnc').value;
    const n = document.getElementById('nonceInputEnc').value;
    if (k) document.getElementById('keyInputDec').value   = k;
    if (n) document.getElementById('nonceInputDec').value = n;
  } else {
    const k = document.getElementById('keyInputDec').value;
    const n = document.getElementById('nonceInputDec').value;
    if (k) document.getElementById('keyInputEnc').value   = k;
    if (n) document.getElementById('nonceInputEnc').value = n;
  }
  document.getElementById('panelEnc').style.display = tab === 'enc' ? 'block' : 'none';
  document.getElementById('panelDec').style.display = tab === 'dec' ? 'block' : 'none';
  document.getElementById('tabEnc').classList.toggle('active', tab === 'enc');
  document.getElementById('tabDec').classList.toggle('active', tab === 'dec');
}

// ── Enkripsi ──
function doEncrypt() {
  clearError('enc');
  const pt    = document.getElementById('plaintextInput').value.trim();
  const key   = document.getElementById('keyInputEnc').value.trim();
  const nonce = document.getElementById('nonceInputEnc').value.trim();

  if (!pt)  { showError('enc', 'Plaintext tidak boleh kosong.'); return; }
  if (!key) { showError('enc', 'Key tidak boleh kosong.'); return; }

  try {
    const { ciphertext, nonce: usedNonce } = encrypt(pt, key, nonce);
    document.getElementById('ciphertextOut').textContent = ciphertext;
    if (!nonce) document.getElementById('nonceInputEnc').value = usedNonce;
    showResult('enc');
  } catch (e) {
    showError('enc', e.message);
  }
}

// ── Dekripsi ──
function doDecrypt() {
  clearError('dec');
  const ct    = document.getElementById('ciphertextInput').value.trim();
  const key   = document.getElementById('keyInputDec').value.trim();
  const nonce = document.getElementById('nonceInputDec').value.trim();

  if (!ct)    { showError('dec', 'Ciphertext tidak boleh kosong.'); return; }
  if (!key)   { showError('dec', 'Key tidak boleh kosong.'); return; }
  if (!nonce) { showError('dec', 'Nonce tidak boleh kosong.'); return; }

  try {
    const { plaintext } = decrypt(ct, key, nonce);
    document.getElementById('plaintextOut').textContent = plaintext;
    showResult('dec');
  } catch (e) {
    showError('dec', e.message);
  }
}

// ── Generate ──
function doGenerateKey(id) {
  const el = document.getElementById(id);
  el.value = generateKey();
  flash(el);
}

function doGenerateNonce(id) {
  const el = document.getElementById(id);
  el.value = generateNonceHex();
  flash(el);
}

// ── Toggle key visibility ──
function toggleKeyVisibility(id, btn) {
  const el = document.getElementById(id);
  const show = el.type === 'password';
  el.type = show ? 'text' : 'password';
  btn.innerHTML = show
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
}

// ── Reset ──
function resetEnc() {
  document.getElementById('plaintextInput').value = '';
  document.getElementById('keyInputEnc').value    = '';
  document.getElementById('nonceInputEnc').value  = '';
  document.getElementById('ciphertextOut').textContent = '';
  hideResult('enc'); clearError('enc');
}

function resetDec() {
  document.getElementById('ciphertextInput').value = '';
  document.getElementById('keyInputDec').value     = '';
  document.getElementById('nonceInputDec').value   = '';
  document.getElementById('plaintextOut').textContent = '';
  hideResult('dec'); clearError('dec');
}

// ── Copy ──
async function copyResult(id, btn) {
  const text = document.getElementById(id).textContent.trim();
  if (!text) return;
  try { await navigator.clipboard.writeText(text); } catch { fallbackCopy(text); }
  const orig = btn.innerHTML;
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><polyline points="20 6 9 17 4 12"/></svg> Tersalin`;
  setTimeout(() => { btn.innerHTML = orig; }, 1800);
}

function fallbackCopy(text) {
  const ta = Object.assign(document.createElement('textarea'), { value: text, style: 'position:fixed;opacity:0' });
  document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
}

// ── Helpers ──
function showError(tab, msg) {
  const e = document.getElementById('error' + cap(tab));
  document.getElementById('error' + cap(tab) + 'Msg').textContent = msg;
  e.classList.add('visible');
}
function clearError(tab) { document.getElementById('error' + cap(tab)).classList.remove('visible'); }
function showResult(tab) { document.getElementById('result' + cap(tab)).classList.add('visible'); }
function hideResult(tab) { document.getElementById('result' + cap(tab)).classList.remove('visible'); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function flash(el) { el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 350); }

// ── Keyboard shortcut Ctrl+Enter ──
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    document.getElementById('tabEnc').classList.contains('active') ? doEncrypt() : doDecrypt();
  }
});