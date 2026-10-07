import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

const A = ({ href, ...p }) =>
  href?.startsWith('/') ? <Link to={href} {...p} /> : <a href={href} {...p} />;

const ROUTES = { home: '/', lostFound: '/lostfound', aspirasi: '/aspirasi' };
const STORAGE_KEY = 'kampusmart-lostfound';

const CATS = [
  ['kartu', 'Kartu & Dokumen', 'badge'], ['kunci', 'Kunci & Kendaraan', 'key'],
  ['elektronik', 'HP & Elektronik', 'smartphone'], ['laptop', 'Laptop & Tablet', 'laptop_mac'],
  ['tas', 'Tas & Aksesori', 'backpack'], ['pakaian', 'Pakaian', 'checkroom'],
  ['buku', 'Buku & Alat Tulis', 'menu_book'], ['botol', 'Botol & Tumbler', 'local_drink'],
  ['lain', 'Lainnya', 'category'],
];
const catOf = (id) => CATS.find((c) => c[0] === id) || CATS[CATS.length - 1];
const COLORS = { Hitam: '#111827', Putih: '#f8fafc', 'Abu-abu': '#94a3b8', Biru: '#2563eb', Merah: '#dc2626', Hijau: '#16a34a', Coklat: '#92400e', Kuning: '#eab308', Pink: '#ec4899', Lainnya: 'conic-gradient(#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)' };

const NOW = Date.now();
const SEED = [
  { id: 's1', type: 'temuan', jenis: 'kunci', nama: 'Kunci Motor Honda Vario', warna: 'Hitam', ciri: 'Gantungan boneka karakter Pikachu, kunci kontak remoteless (smart key).', lokasi: 'Parkiran belakang Gedung FTI', gambar: null, wa: '628123456789', createdAt: NOW - 35 * 60e3 },
  { id: 's2', type: 'hilang', jenis: 'kartu', nama: 'KTM & Dompet Lipat Budi Santoso', warna: 'Coklat', ciri: 'Dompet kulit cokelat merk Baellerry berisi KTM dan kartu e-money.', lokasi: 'Meja kantin pusat Lt. 1 dekat kasir', gambar: null, wa: '628123456789', createdAt: NOW - 2 * 3600e3 },
  { id: 's3', type: 'temuan', jenis: 'laptop', nama: 'Laptop ASUS VivoBook 14', warna: 'Abu-abu', ciri: 'Ada stiker GitHub & Figma di cover depan, charger bawaan dalam sleeve abu gelap.', lokasi: 'Meja coworking Perpustakaan Lt. 2', gambar: null, wa: '628123456789', createdAt: NOW - 3 * 3600e3 },
  { id: 's4', type: 'hilang', jenis: 'botol', nama: 'Tumbler Hydro Flask 32oz Lilac', warna: 'Lainnya', ciri: 'Lecet sedikit di bagian bawah, tutup hitam dengan strap silikon orisinal.', lokasi: 'Ruang Kuliah Bersama 304 Gedung GKB', gambar: null, wa: '628123456789', createdAt: NOW - 26 * 3600e3 },
];

const normalizeWa = (raw) => {
  let d = String(raw).replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  else if (d.startsWith('8')) d = '62' + d;
  return d;
};
const validWa = (d) => /^62\d{9,13}$/.test(d);

const timeAgo = (ts) => {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d} hari lalu` : new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const waLink = (it) => {
  const msg = it.type === 'temuan'
    ? `Halo, saya melihat laporan penemuan "${it.nama}" di KampuSmart. Sepertinya itu barang saya, boleh saya konfirmasi ciri-cirinya?`
    : `Halo, saya melihat laporan kehilangan "${it.nama}" di KampuSmart. Sepertinya saya menemukan barang tersebut.`;
  return `https://wa.me/${it.wa}?text=${encodeURIComponent(msg)}`;
};

const readFile = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = rej;
  r.readAsDataURL(file);
});
const compress = (src, max = 900) => new Promise((res) => {
  const img = new Image();
  img.onload = () => {
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    res(c.toDataURL('image/jpeg', 0.78));
  };
  img.onerror = () => res(src);
  img.src = src;
});

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch (e) { return initial; }
  });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); setFailed(false); } catch (e) { setFailed(true); }
  }, [key, value]);
  return [value, setValue, failed];
}

const Ic = ({ n, className = '', fill }) => (
  <span className={`material-symbols-outlined select-none ${className}`} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{n}</span>
);

const esc = (c) => c.replace(/[:/]/g, '\\$&');
const DARK_CSS = [
  ['bg-white', 'background-color:#0f1b17'], ['bg-white/60', 'background-color:rgba(15,27,23,.6)'],
  ['bg-slate-50/60', 'background-color:rgba(255,255,255,.04)'], ['bg-slate-100', 'background-color:rgba(255,255,255,.07)'],
  ['text-slate-900', 'color:#e8f3ee'], ['text-slate-700', 'color:#cbd8d2'], ['text-slate-600', 'color:#b5c4bd'],
  ['text-slate-500', 'color:#94a7a0'], ['text-slate-400', 'color:#70847c'], ['text-slate-300', 'color:#4f625b'],
  ['border-slate-200', 'border-color:rgba(255,255,255,.1)'], ['border-slate-300', 'border-color:rgba(255,255,255,.16)'],
  ['border-slate-100', 'border-color:rgba(255,255,255,.07)'], ['border-emerald-200', 'border-color:rgba(52,211,153,.3)'],
  ['text-emerald-900', 'color:#a7f3d0'], ['text-emerald-800', 'color:#6ee7b7'], ['text-emerald-700', 'color:#34d399'],
  ['bg-emerald-50', 'background-color:rgba(16,185,129,.12)'], ['bg-emerald-100', 'background-color:rgba(16,185,129,.2)'],
  ['bg-red-50', 'background-color:rgba(239,68,68,.15)'], ['bg-red-100', 'background-color:rgba(239,68,68,.2)'],
  ['text-red-600', 'color:#f87171'], ['text-red-700', 'color:#fca5a5'],
  ['bg-teal-50', 'background-color:rgba(20,184,166,.15)'], ['text-teal-700', 'color:#5eead4'],
  ['hover:bg-white', 'background-color:#14261f', ':hover'], ['hover:bg-slate-100', 'background-color:rgba(255,255,255,.12)', ':hover'],
  ['hover:bg-emerald-50', 'background-color:rgba(16,185,129,.2)', ':hover'], ['hover:bg-red-50', 'background-color:rgba(239,68,68,.18)', ':hover'],
  ['hover:text-slate-900', 'color:#fff', ':hover'], ['hover:text-emerald-800', 'color:#a7f3d0', ':hover'],
  ['hover:text-emerald-700', 'color:#6ee7b7', ':hover'], ['hover:border-slate-300', 'border-color:rgba(255,255,255,.22)', ':hover'],
  ['bg-white/95', 'background-color:rgba(15,27,23,.95)'], ['text-slate-800', 'color:#dce9e3'],
  ['hover:bg-white/50', 'background-color:rgba(255,255,255,.08)', ':hover'],
].map(([c, css, ps = '']) => `.kd-dark .${esc(c)}${ps}{${css}!important}`).join('');

const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes bar{from{width:0}to{width:100%}}
@keyframes pulseRing{0%{transform:scale(.9);opacity:.6}100%{transform:scale(1.6);opacity:0}}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.anim-bar{animation:bar 1.6s cubic-bezier(.4,0,.2,1) forwards}
@keyframes rip{from{transform:scale(0);opacity:.25}to{transform:scale(1);opacity:0}}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
.reveal.in{opacity:1;transform:none}
.anim-up{animation:fadeUp .8s cubic-bezier(.22,1,.36,1) both}
.clamp2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ripple{position:relative;overflow:hidden}
.rip{position:absolute;border-radius:9999px;background:currentColor;transform:scale(0);animation:rip .7s ease-out forwards;pointer-events:none}
.kd a,.kd button{cursor:pointer;-webkit-tap-highlight-color:transparent}
.kd :focus-visible{outline:2px solid #10b981;outline-offset:2px}
.theming,.theming *{transition:background-color .5s ease,color .5s ease,border-color .5s ease!important}
.page-bg{position:fixed;inset:0;z-index:-10;pointer-events:none;
 background:radial-gradient(640px circle at 12% calc(var(--p,0)*100%),rgba(16,185,129,.28),transparent 65%),
 radial-gradient(720px circle at 88% calc(100% - var(--p,0)*100%),rgba(52,211,153,.24),transparent 65%),
 linear-gradient(180deg,#fff 0%,#ecfdf5 22%,#bbf7d0 50%,#ecfdf5 78%,#fff 100%);
 background-size:auto,auto,100% 300%;background-position:0 0,0 0,0 calc(var(--p,0)*100%)}
.kd-dark .page-bg{background:radial-gradient(640px circle at 12% calc(var(--p,0)*100%),rgba(16,185,129,.2),transparent 65%),
 radial-gradient(720px circle at 88% calc(100% - var(--p,0)*100%),rgba(6,95,70,.4),transparent 65%),
 linear-gradient(180deg,#08100d 0%,#0a1f18 22%,#0d3b2d 50%,#0a1f18 78%,#08100d 100%);
 background-size:auto,auto,100% 300%;background-position:0 0,0 0,0 calc(var(--p,0)*100%)}
.nav-glass{background:rgba(255,255,255,.28);-webkit-backdrop-filter:blur(10px) saturate(170%);backdrop-filter:blur(10px) saturate(170%);
 border:1px solid rgba(255,255,255,.6);box-shadow:0 8px 32px rgba(6,78,59,.1),inset 0 1px 0 rgba(255,255,255,.6);
 transition:background .4s,box-shadow .4s,max-width .6s cubic-bezier(.22,1,.36,1)}
.nav-glass.sc{background:rgba(255,255,255,.42);box-shadow:0 14px 40px rgba(6,78,59,.18),inset 0 1px 0 rgba(255,255,255,.6)}
.kd-dark .nav-glass{background:rgba(12,22,18,.3);border-color:rgba(255,255,255,.14);box-shadow:0 8px 32px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.08)}
.kd-dark .nav-glass.sc{background:rgba(12,22,18,.5)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
@media (max-width:639px){.clamp-m{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}
${DARK_CSS}
.kd-dark{color:#e8f3ee!important}
.kd-dark input,.kd-dark textarea,.kd-dark select{color:#e8f3ee!important;background:#0f1b17!important}
.kd-dark ::placeholder{color:#70847c!important}
.kd-dark select option{background:#0f1b17;color:#e8f3ee}`;

const go = 'font-[Sora]';
const ease = 'ease-[cubic-bezier(.22,1,.36,1)]';
const cardBase = 'bg-white border border-slate-200 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,.04)] transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_14px_24px_-6px_rgba(6,78,59,.16)] hover:-translate-y-1';
const NAV = [
  { label: 'Homepage', href: ROUTES.home },
  { label: 'Lost & Found', href: ROUTES.lostFound, active: true },
  { label: 'Aspirasi', href: ROUTES.aspirasi },
];

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${on ? 'in' : ''} ${className}`}>{children}</div>;
}

function ThemeToggle({ dark, onToggle }) {
  const sw = 'absolute inset-0 grid place-items-center transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]';
  return (
    <button onClick={onToggle} aria-label={dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'} title={dark ? 'Mode terang' : 'Mode gelap'}
      className="ripple relative w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-800 hover:bg-emerald-600/20 hover:scale-110 hover:shadow-[0_0_0_4px_rgba(16,185,129,.15)] active:scale-90 transition-all duration-300">
      <span className={`${sw} ${dark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}><Ic n="light_mode" fill className="!text-[22px]" /></span>
      <span className={`${sw} ${dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}><Ic n="dark_mode" fill className="!text-[22px]" /></span>
    </button>
  );
}

function Modal({ open, onClose, wide, children }) {
  return (
    <div className={`fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4 transition-[visibility] duration-500 ${open ? 'visible' : 'invisible'}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <div role="dialog" aria-modal="true" className={`relative w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all duration-500 ${ease} ${open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 sm:translate-y-4 scale-95 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

const CloseBtn = ({ onClick }) => (
  <button type="button" aria-label="Tutup" onClick={onClick} className="ripple w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 active:scale-90 transition-all duration-300"><Ic n="close" className="!text-[22px]" /></button>
);

const inputCls = (err) => `w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 ${err ? 'border-red-400' : 'border-slate-200'}`;

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      {children}
      {error ? <span className="block text-xs text-red-600 mt-1">{error}</span> : hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

function Select({ value, onChange, children, className = '', err }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls(err)} appearance-none pr-10 cursor-pointer`}>{children}</select>
      <Ic n="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none !text-[20px]" />
    </div>
  );
}

const EMPTY = { jenis: '', nama: '', warna: '', ciri: '', lokasi: '', wa: '', gambar: null };

function ReportForm({ open, mode, setMode, onClose, onSubmit }) {
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);
  const lost = mode === 'hilang';

  useEffect(() => { if (open) { setF(EMPTY); setErr({}); } }, [open]);

  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErr((p) => ({ ...p, [k]: undefined })); };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErr((p) => ({ ...p, gambar: 'File harus berupa gambar (JPG, PNG, WEBP)' }));
    if (file.size > 8 * 1024 * 1024) return setErr((p) => ({ ...p, gambar: 'Ukuran gambar maksimal 8 MB' }));
    setBusy(true);
    try { set('gambar', await compress(await readFile(file))); } catch (e) { setErr((p) => ({ ...p, gambar: 'Gagal membaca gambar' })); }
    setBusy(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const wa = normalizeWa(f.wa);
    const n = {};
    if (!f.jenis) n.jenis = 'Pilih jenis barang';
    if (f.nama.trim().length < 3) n.nama = 'Isi nama barang (minimal 3 huruf)';
    if (!f.warna) n.warna = 'Pilih warna utama barang';
    if (lost && f.ciri.trim().length < 5) n.ciri = 'Jelaskan ciri-ciri khusus agar mudah dikenali';
    if (f.lokasi.trim().length < 3) n.lokasi = lost ? 'Isi lokasi terakhir barang terlihat' : 'Isi lokasi barang ditemukan';
    if (!validWa(wa)) n.wa = 'Nomor WhatsApp tidak valid (contoh: 081234567890)';
    setErr(n);
    if (Object.keys(n).length) return;
    onSubmit({ type: mode, jenis: f.jenis, nama: f.nama.trim(), warna: f.warna, ciri: f.ciri.trim(), lokasi: f.lokasi.trim(), gambar: f.gambar, wa });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={`${go} text-xl font-bold`}>{lost ? 'Lapor Barang Hilang' : 'Lapor Barang Ditemukan'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{lost ? 'Isi data selengkap mungkin agar penemu mudah menghubungimu.' : 'Bantu pemilik menemukan barangnya kembali.'}</p>
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl mt-4">
          {[['hilang', 'Saya Kehilangan', 'fmd_bad'], ['temuan', 'Saya Menemukan', 'handshake']].map(([k, t, i]) => (
            <button key={k} type="button" onClick={() => setMode(k)} className={`ripple flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold active:scale-95 transition-all duration-300 ${mode === k ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
              <Ic n={i} fill className="!text-[18px]" />{t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 sm:px-6 py-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Jenis barang" error={err.jenis}>
            <Select value={f.jenis} onChange={(v) => set('jenis', v)} err={err.jenis}>
              <option value="">Pilih jenis barang</option>
              {CATS.map(([id, l]) => <option key={id} value={id}>{l}</option>)}
            </Select>
          </Field>
          <Field label="Nama barang" error={err.nama}>
            <input className={inputCls(err.nama)} value={f.nama} onChange={(e) => set('nama', e.target.value)} placeholder="Contoh: Dompet kulit lipat" maxLength={80} />
          </Field>
        </div>

        <div>
          <span className="block text-sm font-semibold mb-1.5">Warna utama</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(COLORS).map(([n, c]) => (
              <button key={n} type="button" onClick={() => set('warna', n)} aria-pressed={f.warna === n}
                className={`ripple inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs font-medium hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${f.warna === n ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/25' : 'border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
                <span className="w-4 h-4 rounded-full border border-slate-300" style={{ background: c }} />{n}
              </button>
            ))}
          </div>
          {err.warna && <span className="block text-xs text-red-600 mt-1">{err.warna}</span>}
        </div>

        <Field label="Ciri-ciri khusus" error={err.ciri} hint={lost ? 'Stiker, goresan, isi barang, merk, atau tanda lain.' : 'Opsional. Sebutkan ciri umum saja, simpan detail untuk verifikasi pemilik.'}>
          <textarea rows={3} className={`${inputCls(err.ciri)} resize-none`} value={f.ciri} onChange={(e) => set('ciri', e.target.value)} placeholder="Contoh: ada gantungan kunci boneka, goresan di sudut kiri" maxLength={300} />
        </Field>

        <Field label={lost ? 'Terakhir ada di mana?' : 'Ditemukan di mana?'} error={err.lokasi}>
          <div className="relative">
            <Ic n="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]" />
            <input className={`${inputCls(err.lokasi)} pl-10`} value={f.lokasi} onChange={(e) => set('lokasi', e.target.value)} placeholder="Contoh: Kantin pusat Gedung GKB Lt. 1" maxLength={100} />
          </div>
        </Field>

        <div>
          <span className="block text-sm font-semibold mb-1.5">Foto barang <span className="font-normal text-slate-400">(opsional)</span></span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
          {f.gambar ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
              <img src={f.gambar} alt="Pratinjau barang" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1.5 rounded-full bg-white/90 text-black text-xs font-semibold shadow hover:bg-white/95 hover:-translate-y-0.5 active:scale-95 transition-all">Ganti</button>
                <button type="button" aria-label="Hapus foto" onClick={() => set('gambar', null)} className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-500 hover:-translate-y-0.5 active:scale-90 transition-all"><Ic n="delete" className="!text-[18px]" /></button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
              className={`ripple w-full rounded-2xl border-2 border-dashed py-8 flex flex-col items-center gap-1.5 text-center transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50 active:scale-[.99] ${drag ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-slate-50/60'}`}>
              <div className={`w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center ${busy ? 'animate-pulse' : ''}`}><Ic n={busy ? 'hourglass_top' : 'add_photo_alternate'} /></div>
              <span className="text-sm font-semibold">{busy ? 'Memproses gambar...' : 'Klik atau seret foto ke sini'}</span>
              <span className="text-xs text-slate-500">JPG, PNG, WEBP maks. 8 MB</span>
            </button>
          )}
          {err.gambar && <span className="block text-xs text-red-600 mt-1">{err.gambar}</span>}
        </div>

        <Field label="Nomor WhatsApp" error={err.wa} hint="Hanya dipakai agar orang lain bisa menghubungimu lewat tombol WhatsApp.">
          <div className="relative">
            <Ic n="chat" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]" />
            <input type="tel" inputMode="tel" className={`${inputCls(err.wa)} pl-10`} value={f.wa} onChange={(e) => set('wa', e.target.value)} placeholder="081234567890" maxLength={16} />
          </div>
        </Field>
      </div>

      <div className="sticky bottom-0 bg-white/95 backdrop-blur px-5 sm:px-6 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button type="button" onClick={onClose} className="ripple px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 active:scale-[.97] transition-all">Batal</button>
        <button type="submit" disabled={busy} className="ripple inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-[.97] disabled:opacity-60 disabled:pointer-events-none transition-all duration-300">
          <Ic n="send" fill className="!text-[18px]" />{lost ? 'Kirim Laporan Kehilangan' : 'Kirim Laporan Penemuan'}
        </button>
      </div>
    </form>
  );
}

const Badge = ({ type, small }) => (
  <span className={`inline-flex items-center gap-1 rounded-full font-bold shadow-sm ${small ? 'px-1.5 py-0.5 text-[9px] sm:px-2.5 sm:py-1 sm:text-[11px]' : 'px-2.5 py-1 text-[11px]'} ${type === 'hilang' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-900'}`}>
    <span className={small ? 'hidden sm:inline-flex' : 'inline-flex'}><Ic n={type === 'hilang' ? 'search' : 'inventory_2'} className="!text-[13px]" /></span>{type === 'hilang' ? 'Dicari Pemilik' : 'Ditemukan'}
  </span>
);

function Cover({ item, className = '', compact }) {
  const [, , icon] = catOf(item.jenis);
  return item.gambar
    ? <img src={item.gambar} alt={item.nama} loading="lazy" className={`w-full h-full object-cover ${className}`} />
    : <div className={`w-full h-full flex items-center justify-center ${item.type === 'hilang' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}><Ic n={icon} fill className={`${compact ? '!text-[34px] sm:!text-[56px]' : '!text-[56px]'} opacity-70`} /></div>;
}

function ItemCard({ item, index, onOpen, highlight }) {
  const [, label] = catOf(item.jenis);
  return (
    <button type="button" onClick={() => onOpen(item)} className={`${cardBase} anim-up group text-left w-full overflow-hidden flex flex-col active:scale-[.98] ${highlight ? 'ring-2 ring-emerald-500 shadow-xl' : ''}`} style={{ animationDelay: `${(index % 9) * 60}ms` }}>
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden">
        <div className="w-full h-full group-hover:scale-105 transition-transform duration-700"><Cover item={item} compact /></div>
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3"><Badge type={item.type} small /></div>
        <span className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-900/60 backdrop-blur text-white text-[9px] sm:text-[11px] font-medium">{timeAgo(item.createdAt)}</span>
      </div>
      <div className="p-2.5 sm:p-4 flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
        <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-700 truncate">{label}</span>
        <h3 className={`${go} font-bold leading-snug text-[11px] sm:text-base clamp-m`}>{item.nama}</h3>
        <div className="hidden sm:block"><p className="text-sm text-slate-500 clamp2">{item.ciri || 'Tidak ada ciri-ciri tambahan.'}</p></div>
        <div className="sm:mt-1 space-y-1 text-[10px] sm:text-xs text-slate-500 min-w-0">
          <p className="flex items-center gap-1 sm:gap-1.5"><Ic n="location_on" className="!text-[12px] sm:!text-[15px] text-emerald-700" /><span className="truncate">{item.lokasi}</span></p>
          <p className="hidden sm:flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-slate-300 ml-0.5" style={{ background: COLORS[item.warna] }} />{item.warna}</p>
        </div>
        <span className="mt-auto pt-1.5 sm:pt-3 flex items-center gap-1 text-[10px] sm:text-sm font-semibold text-emerald-800">Lihat Detail<span className="hidden sm:inline-flex"><Ic n="arrow_forward" className="!text-[16px] group-hover:translate-x-1.5 transition-transform duration-300" /></span></span>
      </div>
    </button>
  );
}

function DetailView({ open, item, onClose, onDelete }) {
  const [sure, setSure] = useState(false);
  useEffect(() => { setSure(false); }, [open, item?.id]);
  if (!item) return null;
  const [, label, icon] = catOf(item.jenis);
  const lost = item.type === 'hilang';
  return (
    <>
      <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-3xl">
        <Cover item={item} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="absolute top-4 left-4"><Badge type={item.type} /></div>
        <button type="button" aria-label="Tutup" onClick={onClose} className="ripple absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center shadow hover:bg-white/95 hover:rotate-90 active:scale-90 transition-all duration-300"><Ic n="close" className="!text-[20px]" /></button>
      </div>
      <div className="p-5 sm:p-6">
        <h2 className={`${go} text-xl sm:text-2xl font-bold leading-snug`}>{item.nama}</h2>
        <p className="text-xs text-slate-500 mt-1">Dilaporkan {timeAgo(item.createdAt)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {[[icon, 'Jenis', label], ['palette', 'Warna', item.warna], ['location_on', lost ? 'Terakhir terlihat' : 'Ditemukan di', item.lokasi]].map(([i, l, v]) => (
            <div key={l} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <p className="text-[11px] text-slate-500 flex items-center gap-1"><Ic n={i} className="!text-[14px] text-emerald-700" />{l}</p>
              <p className="text-sm font-semibold mt-0.5 break-words">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-bold mb-1">Ciri-ciri khusus</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{item.ciri || 'Tidak ada ciri-ciri tambahan.'}</p>
        </div>
        <A href={waLink(item)} target="_blank" rel="noopener noreferrer" className="ripple mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg active:scale-[.98] transition-all duration-300">
          <Ic n="chat" fill className="!text-[20px]" />{lost ? 'Saya Menemukannya — Hubungi Pemilik' : 'Ini Barang Saya — Hubungi Penemu'}
        </A>
        <p className="text-[11px] text-slate-500 text-center mt-2">Tombol membuka WhatsApp. Verifikasi identitas sebelum serah terima, sebaiknya di Pos Satpam.</p>
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={() => (sure ? onDelete(item.id) : setSure(true))} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold active:scale-95 transition-all duration-300 ${sure ? 'bg-red-600 text-white hover:bg-red-500' : 'text-red-600 hover:bg-red-50'}`}>
            <Ic n="delete" className="!text-[16px]" />{sure ? 'Klik lagi untuk menghapus laporan' : 'Hapus laporan ini'}
          </button>
        </div>
      </div>
    </>
  );
}

export default function PageLostFound() {
  const rootRef = useRef(null);
  const toastRef = useRef(null);
  const [items, setItems, storageFailed] = useLocalStorage(STORAGE_KEY, SEED);
  const [tab, setTab] = useState('semua');
  const [q, setQ] = useState('');
  const [fJenis, setFJenis] = useState('');
  const [fWarna, setFWarna] = useState('');
  const [sort, setSort] = useState('baru');
  const [limit, setLimit] = useState(12);
  const [form, setForm] = useState({ open: false, mode: 'hilang' });
  const [detail, setDetail] = useState({ open: false, item: null });
  const [newId, setNewId] = useState(null);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [toast, setToast] = useState({ m: '', show: false });
  const [theming, setTheming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(false);
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem('ks-theme'); if (s) return s === 'dark'; } catch (e) {}
    return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  });

  const showToast = (m) => {
    setToast({ m, show: true });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  };
  const toggleTheme = () => { setTheming(true); setDark((d) => !d); setTimeout(() => setTheming(false), 650); };

  useEffect(() => { if (storageFailed) showToast('Penyimpanan browser penuh, laporan tidak tersimpan'); }, [storageFailed]);

  useEffect(() => {
    const add = (href, id) => {
      if (document.getElementById(id)) return;
      const l = document.createElement('link');
      l.id = id; l.rel = 'stylesheet'; l.href = href;
      document.head.appendChild(l);
    };
    add('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap', 'f-text');
    add('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0', 'f-icon');
    const t1 = setTimeout(() => setHide(true), 1900);
    const t2 = setTimeout(() => setLoading(false), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!loading) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  useEffect(() => {
    try { localStorage.setItem('ks-theme', dark ? 'dark' : 'light'); } catch (e) {}
    document.body.style.backgroundColor = dark ? '#08100d' : '#ffffff';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        rootRef.current?.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
        setScrolled(y > 12);
        setShowTop(y > 600);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest?.('.ripple');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const s = Math.max(r.width, r.height) * 2;
      const sp = document.createElement('span');
      sp.className = 'rip';
      sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      el.appendChild(sp);
      setTimeout(() => sp.remove(), 700);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setMenu(false); setForm((f) => ({ ...f, open: false })); setDetail((d) => ({ ...d, open: false }));
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => { document.body.style.overflow = menu || form.open || detail.open ? 'hidden' : ''; }, [menu, form.open, detail.open]);
  useEffect(() => { setLimit(12); }, [tab, q, fJenis, fWarna, sort]);

  const counts = useMemo(() => ({
    semua: items.length,
    hilang: items.filter((i) => i.type === 'hilang').length,
    temuan: items.filter((i) => i.type === 'temuan').length,
  }), [items]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return items
      .filter((i) => (tab === 'semua' || i.type === tab) && (!fJenis || i.jenis === fJenis) && (!fWarna || i.warna === fWarna)
        && (!k || [i.nama, i.ciri, i.lokasi, i.warna, catOf(i.jenis)[1]].join(' ').toLowerCase().includes(k)))
      .sort((a, b) => (sort === 'baru' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
  }, [items, tab, q, fJenis, fWarna, sort]);

  const openForm = (mode) => setForm({ open: true, mode });
  const closeForm = () => setForm((f) => ({ ...f, open: false }));

  const addItem = (data) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [{ id, createdAt: Date.now(), ...data }, ...prev]);
    setTab('semua'); setQ(''); setFJenis(''); setFWarna(''); setSort('baru');
    setNewId(id); setTimeout(() => setNewId(null), 4000);
    closeForm();
    showToast(data.type === 'hilang' ? 'Laporan kehilangan berhasil dikirim' : 'Laporan penemuan berhasil dikirim');
    setTimeout(() => document.getElementById('daftar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDetail((d) => ({ ...d, open: false }));
    showToast('Laporan dihapus');
  };

  const resetFilter = () => { setTab('semua'); setQ(''); setFJenis(''); setFWarna(''); setSort('baru'); };
  const filtering = tab !== 'semua' || q || fJenis || fWarna;
  const visible = filtered.slice(0, limit);

  return (
    <div ref={rootRef} className={`kd ${dark ? 'kd-dark' : ''} ${theming ? 'theming' : ''} isolate min-h-screen flex flex-col text-slate-900 antialiased font-['Inter'] selection:bg-emerald-200 selection:text-emerald-900`}>
      <style>{CSS}</style>
      <div className="page-bg" aria-hidden="true" />

      {loading && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 transition-opacity duration-500 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative mb-6">
            <span className="absolute inset-0 rounded-3xl bg-emerald-300/40" style={{ animation: 'pulseRing 1.6s ease-out infinite' }} />
            <div className="relative w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-2xl" style={{ animation: 'floaty 2s ease-in-out infinite' }}><Ic n="manage_search" fill className="text-emerald-700 !text-[44px]" /></div>
          </div>
          <h1 className={`${go} text-3xl font-bold text-white tracking-tight`}>KampuSmart</h1>
          <p className="text-emerald-100/80 text-sm mt-1.5">Memuat direktori Lost & Found…</p>
          <div className="mt-8 w-48 h-1.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full rounded-full bg-emerald-300 anim-bar" /></div>
        </div>
      )}

      {/* NAVBAR nya */}
      <div className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <header className={`nav-glass ${scrolled ? 'sc' : ''} pointer-events-auto w-full rounded-full px-2.5 sm:px-3 py-2 flex items-center justify-between gap-3`} style={{ maxWidth: scrolled ? 860 : 1040 }}>
          <A href={ROUTES.home} className="flex items-center gap-2.5 group pl-1 rounded-full">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-transform duration-300"><Ic n="radar" fill className="!text-[20px]" /></div>
            <span className={`${go} text-lg sm:text-xl font-bold text-emerald-800 tracking-tight`}>KampuSmart</span>
          </A>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((l) => (
              <A key={l.label} href={l.href} aria-current={l.active ? 'page' : undefined} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 active:scale-95 ${l.active ? 'bg-emerald-600/15 text-emerald-800 font-semibold' : 'text-slate-600 hover:bg-emerald-600/10 hover:text-emerald-800 hover:-translate-y-px'}`}>{l.label}</A>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
            <button className="ripple hidden sm:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-emerald-600/10 active:scale-95 transition-all duration-300 text-left">
              <div className="w-8 h-8 rounded-full ring-2 ring-emerald-200 bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">MR</div>
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="text-sm font-semibold">M. Rayhan S.</span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1"><Ic n="verified" fill className="!text-[12px]" />Terverifikasi</span>
              </div>
            </button>
            <button aria-label="Buka menu" onClick={() => setMenu(true)} className="ripple md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-600/10 active:scale-90 transition-all"><Ic n="menu" className="!text-[24px]" /></button>
          </div>
        </header>
      </div>

      {/* DRAWER MOBILE */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-[visibility] duration-500 ${menu ? 'visible' : 'invisible'}`}>
        <div onClick={() => setMenu(false)} className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${menu ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white p-5 shadow-2xl transition-transform duration-500 ${ease} ${menu ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-6">
            <span className={`${go} font-bold text-emerald-800 text-lg`}>Menu</span>
            <button aria-label="Tutup menu" onClick={() => setMenu(false)} className="p-2 rounded-full hover:bg-slate-100 hover:rotate-90 active:scale-90 transition-all duration-300"><Ic n="close" /></button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((l, i) => (
              <A key={l.label} href={l.href} onClick={() => setMenu(false)} style={{ transitionDelay: menu ? `${150 + i * 70}ms` : '0ms' }}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-500 ${ease} active:scale-[.97] ${menu ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} ${l.active ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-100 hover:pl-6'}`}>{l.label}</A>
            ))}
          </nav>
          <button onClick={toggleTheme} className="ripple mt-5 w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-emerald-400 active:scale-[.98] transition-all">
            <span>{dark ? 'Mode Terang' : 'Mode Gelap'}</span><Ic n={dark ? 'light_mode' : 'dark_mode'} fill className="text-emerald-700" />
          </button>
        </aside>
      </div>

      <main className="flex-1">
        {/* HERO */}
        <section className="pt-28 md:pt-36 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <nav aria-label="Breadcrumb" className="anim-up flex items-center gap-1.5 text-xs text-slate-500">
              <A href={ROUTES.home} className="hover:text-emerald-700 hover:underline underline-offset-4 transition-colors">Beranda</A>
              <Ic n="chevron_right" className="!text-[16px]" /><span className="text-emerald-800 font-semibold">Lost & Found Kampus</span>
            </nav>
            <div className="mt-5 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="anim-up max-w-2xl" style={{ animationDelay: '.08s' }}>
                <h1 className={`${go} text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]`}>Barang Hilang & Temuan</h1>
                <p className="text-slate-500 mt-3 leading-relaxed">Cari barangmu yang hilang atau bantu pemiliknya menemukan barang yang kamu temukan. Setiap laporan tampil langsung di sini dan bisa dihubungi lewat WhatsApp.</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button onClick={() => openForm('hilang')} className="ripple group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-900/15 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-xl active:scale-[.97] transition-all duration-300">
                    <Ic n="fmd_bad" fill className="!text-[20px] group-hover:scale-110 transition-transform" />Lapor Kehilangan Barang
                  </button>
                  <button onClick={() => openForm('temuan')} className="ripple group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-semibold text-sm hover:bg-emerald-50 hover:border-emerald-500 hover:-translate-y-0.5 hover:shadow-lg active:scale-[.97] transition-all duration-300">
                    <Ic n="handshake" fill className="!text-[20px] group-hover:scale-110 transition-transform" />Lapor Penemuan Barang
                  </button>
                </div>
              </div>
              <div className="anim-up grid grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[380px]" style={{ animationDelay: '.18s' }}>
                {[['Total Laporan', counts.semua, 'inventory_2', 'semua'], ['Dicari Pemilik', counts.hilang, 'search', 'hilang'], ['Ditemukan', counts.temuan, 'task_alt', 'temuan']].map(([l, n, i, k]) => (
                  <button key={l} onClick={() => { setTab(k); document.getElementById('daftar')?.scrollIntoView({ behavior: 'smooth' }); }} className="ripple group bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 text-left hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300">
                    <Ic n={i} fill className="text-emerald-700 !text-[20px] group-hover:scale-110 transition-transform" />
                    <div className={`${go} text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1`}>{n}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{l}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="daftar" className="scroll-mt-24 pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto [scrollbar-width:none]">
                {[['semua', 'Semua Barang'], ['hilang', 'Dicari Pemilik'], ['temuan', 'Ditemukan']].map(([k, t]) => (
                  <button key={k} onClick={() => setTab(k)} className={`ripple flex-1 min-w-fit flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap active:scale-95 transition-all duration-300 ${tab === k ? 'bg-white text-emerald-800 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}>
                    {t}<span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${tab === k ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-500'}`}>{counts[k]}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_190px_150px_150px] gap-3">
                <div className="relative">
                  <Ic n="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama barang, ciri, atau lokasi..." className={`${inputCls(false)} pl-10 pr-10`} />
                  {q && <button aria-label="Hapus pencarian" onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 active:scale-90 transition-all"><Ic n="close" className="!text-[18px]" /></button>}
                </div>
                <Select value={fJenis} onChange={setFJenis}><option value="">Semua Jenis</option>{CATS.map(([id, l]) => <option key={id} value={id}>{l}</option>)}</Select>
                <Select value={fWarna} onChange={setFWarna}><option value="">Semua Warna</option>{Object.keys(COLORS).map((c) => <option key={c} value={c}>{c}</option>)}</Select>
                <Select value={sort} onChange={setSort}><option value="baru">Terbaru</option><option value="lama">Terlama</option></Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 mb-4 text-sm text-slate-500">
              <p>Menampilkan <b className="text-slate-900">{visible.length}</b> dari <b className="text-slate-900">{filtered.length}</b> laporan</p>
              {filtering && <button onClick={resetFilter} className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline underline-offset-4 active:scale-95 transition"><Ic n="restart_alt" className="!text-[18px]" />Reset filter</button>}
            </div>

            {visible.length ? (
              <>
                <div key={`${tab}-${fJenis}-${fWarna}-${sort}`} className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5">
                  {visible.map((it, i) => <ItemCard key={it.id} item={it} index={i} highlight={it.id === newId} onOpen={(item) => setDetail({ open: true, item })} />)}
                </div>
                {filtered.length > limit && (
                  <div className="flex justify-center mt-8">
                    <button onClick={() => setLimit((l) => l + 12)} className="ripple inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-800 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-300"><Ic n="expand_more" className="!text-[20px]" />Tampilkan lebih banyak</button>
                  </div>
                )}
              </>
            ) : (
              <div className="anim-up text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 bg-white/60">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center"><Ic n="search_off" className="!text-[30px]" /></div>
                <p className={`${go} font-bold text-lg mt-3`}>{items.length ? 'Tidak ada laporan yang cocok' : 'Belum ada laporan barang'}</p>
                <p className="text-sm text-slate-500 mt-1">{items.length ? 'Coba ubah kata kunci atau filter pencarianmu.' : 'Jadilah yang pertama membuat laporan.'}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
                  {filtering && <button onClick={resetFilter} className="ripple px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 active:scale-95 transition-all">Reset filter</button>}
                  <button onClick={() => openForm('hilang')} className="ripple px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-600 hover:-translate-y-0.5 active:scale-95 transition-all">Lapor Barang</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* alur klaim */}
        <section className="py-12 md:py-16 bg-white/60 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <Reveal className="text-center max-w-2xl mx-auto mb-10">
              <h2 className={`${go} text-2xl md:text-3xl font-bold tracking-tight mt-1`}>Alur Klaim Barang yang Aman</h2>
              <p className="text-sm text-slate-500 mt-2">Transparan, aman, dan bebas pungli dengan verifikasi identitas mahasiswa.</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[['01', 'Cari atau laporkan barang', 'Telusuri daftar laporan atau buat laporan baru lengkap dengan foto dan ciri-ciri.', 'manage_search', 'Pencarian instan'],
                ['02', 'Hubungi lewat WhatsApp', 'Klik kartu barang, lalu hubungi pelapor untuk mencocokkan ciri-ciri barang.', 'chat', 'Terhubung langsung'],
                ['03', 'Serah terima di tempat aman', 'Bertemu di Pos Satpam atau area ramai kampus dan tunjukkan identitas.', 'verified_user', 'Prosedur aman kampus']].map(([n, t, d, i, f], k) => (
                <Reveal key={n} delay={k * 100}>
                  <div className={`${cardBase} group p-6 h-full flex flex-col`}>
                    <div className={`${go} w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-4 group-hover:bg-emerald-700 group-hover:text-white group-hover:scale-110 transition-all duration-300`}>{n}</div>
                    <h3 className={`${go} font-bold text-lg`}>{t}</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">{d}</p>
                    <div className="mt-auto pt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><Ic n={i} className="!text-[16px]" />{f}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center"><Ic n="radar" fill className="!text-[18px]" /></div><span className={`${go} font-bold text-emerald-800 text-lg`}>KampuSmart</span></div>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">© 2026 KampuSmart. Kolaborasi Resmi BEM & Biro Sarana Prasarana Kampus. Hak Cipta Dilindungi.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            {['Panduan Verifikasi AI', 'Posko Keamanan & Lost-Found', 'Kontak Hotline Kampus', 'Kebijakan Privasi', 'SOP Penyerahan Barang'].map((t) => (
              <A key={t} href="#" className="hover:text-emerald-700 hover:-translate-y-px underline-offset-4 hover:underline active:scale-95 transition-all duration-300">{t}</A>
            ))}
          </nav>
        </div>
      </footer>

      <Modal open={form.open} onClose={closeForm}>
        <ReportForm open={form.open} mode={form.mode} setMode={(m) => setForm((f) => ({ ...f, mode: m }))} onClose={closeForm} onSubmit={addItem} />
      </Modal>
      <Modal open={detail.open} onClose={() => setDetail((d) => ({ ...d, open: false }))} wide>
        <DetailView open={detail.open} item={detail.item} onClose={() => setDetail((d) => ({ ...d, open: false }))} onDelete={removeItem} />
      </Modal>

      <button aria-label="Kembali ke atas" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`ripple fixed bottom-6 left-10 z-40 w-12 h-12 rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-xl active:scale-90 transition-all duration-500 ${ease} ${showTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75 pointer-events-none'}`}><Ic n="arrow_upward" /></button>

      <div role="status" aria-live="polite" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-full bg-emerald-900 text-white text-sm font-medium shadow-2xl flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] ${toast.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-90 pointer-events-none'}`}>
        <Ic n="check_circle" fill className="text-emerald-300 !text-[18px]" />{toast.m}
      </div>
    </div>
  );
}