import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// link internal pakai Link (tanpa reload), link eksternal / "#" tetap <a>
const A = ({ href, ...p }) =>
  href?.startsWith('/') ? <Link to={href} {...p} /> : <a href={href} {...p} />;

const ROUTES = { home: '/', lostFound: '/lostfound', aspirasi: '/aspirasi' };
const go = 'font-[Sora]';
const ease = 'ease-[cubic-bezier(.22,1,.36,1)]';

const Ic = ({ n, className = '', fill }) => (
  <span className={`material-symbols-outlined select-none ${className}`} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{n}</span>
);

/* ini buat ubah tema warna*/
const esc = (c) => c.replace(/[:/]/g, '\\$&');
const DARK_CSS = [
  ['bg-white', 'background-color:#0f1b17'],
  ['bg-white/60', 'background-color:rgba(15,27,23,.6)'],
  ['bg-slate-50/60', 'background-color:rgba(255,255,255,.04)'],
  ['bg-slate-100', 'background-color:rgba(255,255,255,.07)'],
  ['text-slate-900', 'color:#e8f3ee'], ['text-slate-700', 'color:#cbd8d2'], ['text-slate-600', 'color:#b5c4bd'],
  ['text-slate-500', 'color:#94a7a0'], ['text-slate-400', 'color:#70847c'], ['text-slate-300', 'color:#4f625b'],
  ['border-slate-200', 'border-color:rgba(255,255,255,.1)'], ['border-slate-300', 'border-color:rgba(255,255,255,.16)'],
  ['border-slate-100', 'border-color:rgba(255,255,255,.07)'], ['border-emerald-200', 'border-color:rgba(52,211,153,.3)'],
  ['text-emerald-900', 'color:#a7f3d0'], ['text-emerald-800', 'color:#6ee7b7'], ['text-emerald-700', 'color:#34d399'],
  ['bg-emerald-50', 'background-color:rgba(16,185,129,.12)'], ['bg-emerald-100', 'background-color:rgba(16,185,129,.2)'],
  ['bg-red-50', 'background-color:rgba(239,68,68,.15)'], ['bg-red-100', 'background-color:rgba(239,68,68,.2)'],
  ['text-red-600', 'color:#f87171'], ['text-red-700', 'color:#fca5a5'],
  ['bg-teal-50', 'background-color:rgba(20,184,166,.15)'], ['text-teal-700', 'color:#5eead4'],
  ['bg-amber-100', 'background-color:rgba(245,158,11,.2)'], ['text-amber-700', 'color:#fbbf24'],
  ['hover:bg-white', 'background-color:#14261f', ':hover'],
  ['hover:bg-slate-100', 'background-color:rgba(255,255,255,.12)', ':hover'],
  ['hover:bg-emerald-50', 'background-color:rgba(16,185,129,.2)', ':hover'],
  ['hover:bg-emerald-50/30', 'background-color:rgba(16,185,129,.1)', ':hover'],
  ['hover:text-slate-900', 'color:#fff', ':hover'],
  ['hover:text-emerald-800', 'color:#a7f3d0', ':hover'],
  ['hover:text-emerald-700', 'color:#6ee7b7', ':hover'],
  ['hover:border-slate-300', 'border-color:rgba(255,255,255,.22)', ':hover'],
].map(([c, css, ps = '']) => `.kd-dark .${esc(c)}${ps}{${css}!important}`).join('');

const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes bar{from{width:0}to{width:100%}}
@keyframes pulseRing{0%{transform:scale(.9);opacity:.6}100%{transform:scale(1.6);opacity:0}}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes rip{from{transform:scale(0);opacity:.25}to{transform:scale(1);opacity:0}}
@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
.reveal.in{opacity:1;transform:none}
.anim-bar{animation:bar 1.6s cubic-bezier(.4,0,.2,1) forwards}
.anim-up{animation:fadeUp .8s cubic-bezier(.22,1,.36,1) both}
.pop{animation:pop .4s cubic-bezier(.34,1.56,.64,1)}
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

${DARK_CSS}
.kd-dark{color:#e8f3ee!important}
.kd-dark .text-slate-900{color:#e8f3ee!important}
.kd-dark .text-slate-800{color:#dce9e3!important}
.kd-dark .text-slate-700{color:#cbd8d2!important}
.kd-dark .text-slate-600{color:#b5c4bd!important}
.kd-dark .text-slate-500{color:#94a7a0!important}
.kd-dark .text-slate-400{color:#7f938b!important}
.kd-dark .text-slate-300{color:#6f837b!important}
.kd-dark .bg-white{background-color:#0f1b17!important}
.kd-dark .bg-white\\/60{background-color:rgba(15,27,23,.6)!important}
.kd-dark .bg-slate-50\\/60{background-color:rgba(255,255,255,.04)!important}
.kd-dark .bg-slate-100{background-color:rgba(255,255,255,.07)!important}
.kd-dark .border-slate-100{border-color:rgba(255,255,255,.07)!important}
.kd-dark .border-slate-200{border-color:rgba(255,255,255,.1)!important}
.kd-dark .border-slate-300{border-color:rgba(255,255,255,.16)!important}
.kd-dark input,.kd-dark textarea,.kd-dark select{color:#e8f3ee!important;background:#0f1b17!important}
.kd-dark ::placeholder{color:#70847c!important}
`;

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

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString('id-ID')}{suffix}</span>;
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


const EXTRA = `
@keyframes grow{from{width:0}}
@keyframes shake{0%,100%{transform:none}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.clamp2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.clamp3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.shake{animation:shake .35s ease}
`;

const NAV = [
  { label: 'Homepage', href: ROUTES.home },
  { label: 'Lost & Found', href: ROUTES.lostFound },
  { label: 'Aspirasi', href: ROUTES.aspirasi, active: true },
];
const CATS = ['Semua Kategori', 'Fasilitas & Sarpras', 'Akademik & Perkuliahan', 'Keamanan & Parkir', 'Layanan Digital & IT', 'Kesejahteraan & Finansial'];
const STAT = {
  voting: { l: 'Pengumpulan Suara', i: 'hourglass_empty', c: 'bg-slate-100 text-slate-600 border-slate-200' },
  audiensi: { l: 'Tahap Audiensi', i: 'event', c: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  disetujui: { l: 'Disetujui Dekanat', i: 'gavel', c: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
  selesai: { l: 'Selesai Direalisasikan', i: 'verified', c: 'bg-emerald-700 text-white border-emerald-700' },
};
const QUOTA = 1000, DAY = 864e5, KEY = 'ks-aspirasi', VKEY = 'ks-aspirasi-vote';
const T0 = Date.now();
const SEED = [
  { id: 's1', cat: CATS[1], status: 'audiensi', title: 'Kursi Baca Ergonomis & Stopkontak Tambahan di Perpustakaan Lt. 3', desc: 'Banyak mahasiswa sakit punggung saat maraton skripsi. Stopkontak hanya ada di pilar utama sehingga kabel berseliweran dan membahayakan.', author: 'Budi Santoso • Fak. Ilmu Komputer', votes: 842, comments: 38, at: T0 - 3 * DAY },
  { id: 's2', cat: CATS[3], status: 'disetujui', title: 'Penerangan LED & CCTV Tambahan di Parkiran Motor Belakang Gedung FTI', desc: 'Sering terjadi kehilangan helm dan kondisi gelap saat kelas malam. Diperlukan 6 titik lampu LED dan kamera pengawas di pos sekuriti.', author: 'Nadira K. • Fak. Teknik Industri', votes: 1120, comments: 64, at: T0 - 7 * DAY },
  { id: 's3', cat: CATS[4], status: 'voting', title: 'Optimasi Bandwidth Eduroam & WiFi di Area Gazebo dan Kantin', desc: 'Koneksi sering putus pada jam 11:00–13:00 sehingga mengganggu pengerjaan kuis daring mahasiswa.', author: 'Ahmad Rizky • Fak. Ekonomi & Bisnis', votes: 680, comments: 19, at: T0 - 1 * DAY },
  { id: 's4', cat: CATS[1], status: 'voting', title: 'Dispenser Air Minum Refill Gratis di Tiap Lantai Selasar', desc: 'Mendorong kampus zero plastic waste dengan mempermudah mengisi ulang tumbler secara layak dan steril.', author: 'Dewi Lestari • Fak. Kedokteran', votes: 540, comments: 42, at: T0 - 4 * DAY },
  { id: 's5', cat: CATS[2], status: 'audiensi', title: 'Transparansi Penilaian & Standarisasi Rubrik Tugas Praktikum', desc: 'Portal akademik diusulkan menampilkan bobot tugas, kuis, dan ujian sebelum nilai akhir dikunci permanen.', author: 'Fajar Pratama • BEM FMIPA', votes: 910, comments: 56, at: T0 - 5 * DAY },
  { id: 's6', cat: CATS[5], status: 'selesai', title: 'Jam Operasional Co-Working Perpustakaan Hingga 22:00 Saat Ujian', desc: 'Telah direalisasikan Biro Administrasi Kampus dan berlaku mulai masa UTS semester genap.', author: 'Tim Advokasi BEM Universitas', votes: 1450, comments: 88, at: T0 - 21 * DAY },
];
const STEPS = [
  ['verified_user', 'Pengajuan & Verifikasi SSO', 'Login SSO kampus aktif mencegah spam, bot, dan laporan fiktif.'],
  ['how_to_vote', 'Dukungan & Voting', 'Aspirasi yang menembus 1.000 suara otomatis masuk prioritas audiensi.'],
  ['forum', 'Audiensi BEM & Dekanat', 'BEM membawa aspirasi ke Rapat Dengar Pendapat bersama Biro Sarpras.'],
  ['task_alt', 'Realisasi & Monitoring', 'SK, anggaran, dan progres pengerjaan diumumkan terbuka untuk publik.'],
];
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const ago = (t) => {
  const m = Math.floor((Date.now() - t) / 6e4), d = Math.floor(m / 1440);
  return m < 1 ? 'Baru saja' : m < 60 ? `${m} mnt lalu` : m < 1440 ? `${Math.floor(m / 60)} jam lalu` : d < 7 ? `${d} hari lalu` : `${Math.floor(d / 7)} mgg lalu`;
};
const EMPTY = { cat: '', title: '', desc: '', anon: false };

function AspirasiForm({ open, onClose, onSubmit }) {
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [img, setImg] = useState(null);
  const [shake, setShake] = useState(0);
  const fileRef = useRef(null);
  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErr((p) => ({ ...p, [k]: '' })); };
  useEffect(() => { if (!open) { setF(EMPTY); setErr({}); setImg(null); } }, [open]);
  const pick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setErr((p) => ({ ...p, img: 'Ukuran foto maksimal 5MB' }));
    setImg(URL.createObjectURL(file)); setErr((p) => ({ ...p, img: '' }));
  };
  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.cat) x.cat = 'Pilih kategori terlebih dahulu';
    if (f.title.trim().length < 10) x.title = 'Judul minimal 10 karakter';
    if (f.desc.trim().length < 20) x.desc = 'Deskripsi minimal 20 karakter';
    setErr(x);
    if (Object.keys(x).length) return setShake((s) => s + 1);
    onSubmit({ ...f, title: f.title.trim(), desc: f.desc.trim() });
  };
  return (
    <Modal open={open} onClose={onClose} wide>
      <form onSubmit={submit} noValidate>
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0"><Ic n="campaign" fill /></div>
            <div><h2 className={`${go} text-lg sm:text-xl font-bold leading-tight`}>Tulis Aspirasi Baru</h2><p className="text-xs text-slate-500 mt-0.5">Terverifikasi SSO • rata-rata ditinjau BEM &lt; 24 jam</p></div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="px-5 sm:px-6 py-5 space-y-4">
          <Field label="Kategori isu *" error={err.cat}>
            <Select value={f.cat} onChange={(v) => set('cat', v)} err={err.cat}><option value="">Pilih kategori…</option>{CATS.slice(1).map((c) => <option key={c}>{c}</option>)}</Select>
          </Field>
          <Field label="Judul aspirasi *" error={err.title} hint={`${f.title.trim().length}/100 • ringkas & spesifik`}>
            <input value={f.title} maxLength={100} onChange={(e) => set('title', e.target.value)} placeholder="Contoh: Stopkontak tambahan di koridor Gedung D" className={inputCls(err.title)} />
          </Field>
          <Field label="Latar belakang & solusi yang diusulkan *" error={err.desc} hint={`${f.desc.trim().length}/500 • minimal 20 karakter`}>
            <textarea value={f.desc} rows={4} maxLength={500} onChange={(e) => set('desc', e.target.value)} placeholder="Jelaskan kendala yang dialami mahasiswa dan saran perbaikan praktis…" className={`${inputCls(err.desc)} resize-none`} />
          </Field>
          <div>
            <span className="block text-sm font-semibold mb-1.5">Foto bukti lapangan <span className="font-normal text-slate-400">(opsional)</span></span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
            {img ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                <img src={img} alt="Pratinjau" className="w-full h-40 object-cover" />
                <button type="button" onClick={() => setImg(null)} className="absolute top-2 right-2 px-3 py-1.5 rounded-full bg-white/90 text-black text-xs font-semibold shadow hover:bg-white/95 active:scale-95 transition-all">Hapus</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="ripple w-full rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 py-5 flex flex-col items-center gap-1 text-emerald-700 active:scale-[.99] transition-all duration-300">
                <Ic n="add_a_photo" className="!text-[30px]" /><span className="text-sm font-medium">Klik untuk unggah foto</span><span className="text-xs text-slate-500">JPG / PNG, maks. 5MB</span>
              </button>
            )}
            {err.img && <span className="block text-xs text-red-600 mt-1">{err.img}</span>}
          </div>
          <button type="button" role="switch" aria-checked={f.anon} onClick={() => set('anon', !f.anon)} className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 text-left active:scale-[.99] transition-all">
            <span className="flex items-center gap-3"><Ic n={f.anon ? 'visibility_off' : 'visibility'} className="text-emerald-700" />
              <span><span className="block text-sm font-semibold">Tampilkan sebagai anonim</span><span className="block text-xs text-slate-500">Nama tetap tercatat di database BEM untuk validasi.</span></span></span>
            <span className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-300 ${f.anon ? 'bg-emerald-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${f.anon ? 'translate-x-5' : ''}`} /></span>
          </button>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-5 sm:px-6 py-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="ripple px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 active:scale-95 transition-all">Batal</button>
          <button key={shake} type="submit" className={`ripple px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 ${shake ? 'shake' : ''}`}><Ic n="send" className="!text-[18px]" />Kirim Aspirasi</button>
        </div>
      </form>
    </Modal>
  );
}

function Card({ a, voted, onVote, index, fresh }) {
  const s = STAT[a.status], v = a.votes + (voted ? 1 : 0), pct = Math.min(100, Math.round((v / QUOTA) * 100));
  const [pop, setPop] = useState(false);
  const done = a.status === 'selesai' || a.status === 'disetujui';
  return (
    <article style={{ animationDelay: `${(index % 6) * 70}ms` }} className={`anim-up group flex flex-col bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_14px_24px_-6px_rgba(6,78,59,.14)] ${fresh ? 'ring-2 ring-emerald-500 border-emerald-400' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-emerald-700">{a.cat}</span>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${s.c}`}><Ic n={s.i} fill className="!text-[13px]" />{s.l}</span>
      </div>
      <h3 className={`${go} mt-3 font-bold leading-snug text-base clamp2 group-hover:text-emerald-800 transition-colors`}>{a.title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed clamp3">{a.desc}</p>
      <p className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 min-w-0"><Ic n={a.author === 'Anonim' ? 'visibility_off' : 'verified_user'} className="!text-[15px] text-emerald-700" /><span className="truncate font-medium">{a.author}</span><span>•</span><span className="shrink-0">{ago(a.at)}</span></p>
      <div className="mt-3">
        <div className="flex justify-between text-xs font-semibold mb-1.5"><span>{v.toLocaleString('id-ID')} dari {QUOTA.toLocaleString('id-ID')} suara</span><span className="text-emerald-700">{pct}%</span></div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400" style={{ width: `${pct}%`, animation: 'grow 1.2s cubic-bezier(.22,1,.36,1)' }} /></div>
      </div>
      <div className="mt-4 flex gap-2 mt-auto pt-1">
        <button onClick={() => { setPop(true); setTimeout(() => setPop(false), 400); onVote(a); }} disabled={done} aria-pressed={voted}
          className={`ripple flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all duration-300 ${done ? 'bg-slate-100 text-slate-500 cursor-default' : voted ? 'bg-emerald-700 text-white shadow-md' : 'bg-emerald-600/10 text-emerald-800 hover:bg-emerald-700 hover:text-white'}`}>
          <span className={pop ? 'pop' : ''}><Ic n={done ? 'check_circle' : 'thumb_up'} fill={voted || done} className="!text-[18px]" /></span>{done ? 'Suara Ditutup' : voted ? 'Kamu Mendukung' : 'Dukung Suara'}
        </button>
        <span className="inline-flex items-center gap-1 px-3 rounded-xl border border-slate-200 text-sm text-slate-600"><Ic n="chat_bubble" className="!text-[17px]" />{a.comments}</span>
      </div>
    </article>
  );
}

export default function Aspirasi() {
  const rootRef = useRef(null), toastRef = useRef(null), listRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState(false);
  const [theming, setTheming] = useState(false);
  const [toast, setToast] = useState({ m: '', show: false });
  const [mine, setMine] = useState(() => load(KEY, []));
  const [voted, setVoted] = useState(() => load(VKEY, {}));
  const [newId, setNewId] = useState(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(CATS[0]);
  const [st, setSt] = useState('');
  const [sort, setSort] = useState('trend');
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem('ks-theme'); if (s) return s === 'dark'; } catch (e) {}
    return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  });

  const showToast = (m) => { setToast({ m, show: true }); clearTimeout(toastRef.current); toastRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400); };
  const toggleTheme = () => { setTheming(true); setDark((d) => !d); setTimeout(() => setTheming(false), 650); };

  useEffect(() => {
    const add = (href, id) => {
      if (document.getElementById(id)) return;
      const l = document.createElement('link');
      l.id = id; l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
    };
    add('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap', 'f-text');
    add('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0', 'f-icon');
    const t1 = setTimeout(() => setHide(true), 1900), t2 = setTimeout(() => setLoading(false), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  useEffect(() => {
    try { localStorage.setItem('ks-theme', dark ? 'dark' : 'light'); } catch (e) {}
    document.body.style.backgroundColor = dark ? '#08100d' : '#ffffff';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }, [dark]);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(mine)); localStorage.setItem(VKEY, JSON.stringify(voted)); } catch (e) {} }, [mine, voted]);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
        rootRef.current?.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
        setScrolled(y > 12);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest?.('.ripple');
      if (!el) return;
      const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, sp = document.createElement('span');
      sp.className = 'rip';
      sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      el.appendChild(sp); setTimeout(() => sp.remove(), 700);
    };
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(false); setForm(false); } };
    document.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => { document.body.style.overflow = loading || menu || form ? 'hidden' : ''; }, [loading, menu, form]);

  const all = [...mine, ...SEED];
  const list = all
    .filter((a) => (cat === CATS[0] || a.cat === cat) && (!st || a.status === st) && (!q.trim() || `${a.title} ${a.desc} ${a.cat}`.toLowerCase().includes(q.trim().toLowerCase())))
    .sort((a, b) => sort === 'baru' ? b.at - a.at : sort === 'kuota' ? (b.votes + !!voted[b.id]) / QUOTA - (a.votes + !!voted[a.id]) / QUOTA : (b.votes + !!voted[b.id]) - (a.votes + !!voted[a.id]));
  const filtering = q || st || cat !== CATS[0];
  const vote = (a) => {
    setVoted((p) => { const n = { ...p }; if (n[a.id]) delete n[a.id]; else n[a.id] = 1; return n; });
    showToast(voted[a.id] ? 'Dukunganmu dibatalkan' : 'Terima kasih, suaramu tercatat');
  };
  const submit = (f) => {
    const id = `u${Date.now()}`;
    setMine((m) => [{ id, cat: f.cat, status: 'voting', title: f.title, desc: f.desc, author: f.anon ? 'Anonim' : 'M. Rayhan S. • Mahasiswa', votes: 0, comments: 0, at: Date.now() }, ...m]);
    setForm(false); setQ(''); setSt(''); setCat(CATS[0]); setSort('baru'); setNewId(id);
    showToast('Aspirasi terkirim & menunggu peninjauan BEM');
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    setTimeout(() => setNewId(null), 5000);
  };
  const resetFilter = () => { setQ(''); setSt(''); setCat(CATS[0]); };

  return (
    <div ref={rootRef} className={`kd ${dark ? 'kd-dark' : ''} ${theming ? 'theming' : ''} isolate min-h-screen flex flex-col text-slate-900 antialiased font-['Inter'] selection:bg-emerald-200 selection:text-emerald-900`}>
      <style>{CSS}{EXTRA}</style>
      <div className="page-bg" aria-hidden="true" />

      {loading && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 transition-opacity duration-500 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative mb-6">
            <span className="absolute inset-0 rounded-3xl bg-emerald-300/40" style={{ animation: 'pulseRing 1.6s ease-out infinite' }} />
            <div className="relative w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-2xl" style={{ animation: 'floaty 2s ease-in-out infinite' }}><Ic n="campaign" fill className="text-emerald-700 !text-[44px]" /></div>
          </div>
          <h1 className={`${go} text-3xl font-bold text-white tracking-tight`}>KampuSmart</h1>
          <p className="text-emerald-100/80 text-sm mt-1.5">Memuat portal aspirasi…</p>
          <div className="mt-8 w-48 h-1.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full rounded-full bg-emerald-300 anim-bar" /></div>
        </div>
      )}

      <div className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <header className={`nav-glass ${scrolled ? 'sc' : ''} pointer-events-auto w-full rounded-full px-2.5 sm:px-3 py-2 flex items-center justify-between gap-3`} style={{ maxWidth: scrolled ? 860 : 1040 }}>
          <A href={ROUTES.home} className="flex items-center gap-2.5 group pl-1 rounded-full">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-transform duration-300"><Ic n="radar" fill className="!text-[20px]" /></div>
            <span className={`${go} text-lg sm:text-xl font-bold text-emerald-800 tracking-tight`}>KampuSmart</span>
          </A>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((l) => <A key={l.label} href={l.href} aria-current={l.active ? 'page' : undefined} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 active:scale-95 ${l.active ? 'bg-emerald-600/15 text-emerald-800 font-semibold' : 'text-slate-600 hover:bg-emerald-600/10 hover:text-emerald-800 hover:-translate-y-px'}`}>{l.label}</A>)}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
            <div className="hidden sm:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full">
              <div className="w-8 h-8 rounded-full ring-2 ring-emerald-200 bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">MR</div>
              <div className="hidden lg:flex flex-col leading-tight"><span className="text-sm font-semibold">M. Rayhan S.</span><span className="text-[11px] text-emerald-700 flex items-center gap-1"><Ic n="verified" fill className="!text-[12px]" />SSO Terverifikasi</span></div>
            </div>
            <button aria-label="Buka menu" onClick={() => setMenu(true)} className="ripple md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-600/10 active:scale-90 transition-all"><Ic n="menu" className="!text-[24px]" /></button>
          </div>
        </header>
      </div>

      <div className={`fixed inset-0 z-[60] md:hidden transition-[visibility] duration-500 ${menu ? 'visible' : 'invisible'}`}>
        <div onClick={() => setMenu(false)} className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${menu ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white p-5 shadow-2xl transition-transform duration-500 ${ease} ${menu ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-6"><span className={`${go} font-bold text-emerald-800 text-lg`}>Menu</span><button aria-label="Tutup menu" onClick={() => setMenu(false)} className="p-2 rounded-full hover:bg-slate-100 hover:rotate-90 active:scale-90 transition-all duration-300"><Ic n="close" /></button></div>
          <nav className="flex flex-col gap-1">
            {NAV.map((l, i) => <A key={l.label} href={l.href} onClick={() => setMenu(false)} style={{ transitionDelay: menu ? `${150 + i * 70}ms` : '0ms' }} className={`px-4 py-3 rounded-xl font-medium transition-all duration-500 ${ease} active:scale-[.97] ${menu ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} ${l.active ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-100 hover:pl-6'}`}>{l.label}</A>)}
          </nav>
          <button onClick={toggleTheme} className="ripple mt-5 w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-emerald-400 active:scale-[.98] transition-all"><span>{dark ? 'Mode Terang' : 'Mode Gelap'}</span><Ic n={dark ? 'light_mode' : 'dark_mode'} fill className="text-emerald-700" /></button>
        </aside>
      </div>

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-10">
          <nav aria-label="Breadcrumb" className="anim-up flex items-center gap-2 text-xs text-slate-500">
            <A href={ROUTES.home} className="hover:text-emerald-700 hover:underline underline-offset-4 transition-colors flex items-center gap-1"><Ic n="home" className="!text-[16px]" />Beranda</A><span>/</span><span className="text-emerald-800 font-semibold">Aspirasi & Advokasi</span>
          </nav>

          <section className="anim-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white p-6 sm:p-10 shadow-xl shadow-emerald-900/10" style={{ animationDelay: '.08s' }}>
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-300/15 blur-3xl pointer-events-none" />
            <Ic n="account_balance" className="absolute right-8 bottom-2 !text-[200px] opacity-10 hidden lg:block pointer-events-none" />
            <div className="relative max-w-3xl">
              <h1 className={`${go} text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight`}>Tulis aspirasi, kawal sampai ditindaklanjuti.</h1>
              <p className="mt-3 text-sm sm:text-base text-emerald-50/85 leading-relaxed">Portal terbuka penyampaian aspirasi dan perbaikan sarana perkuliahan secara transparan. Setiap suara divalidasi akun SSO dan diperjuangkan dalam Rapat Dengar Pendapat berkala.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setForm(true)} className="ripple inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-800 font-semibold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-300"><Ic n="edit_note" fill />Buat Aspirasi Baru</button>
                <a href="#alur" className="ripple inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"><Ic n="route" />Lihat Alur Proses</a>
              </div>
              <div className="mt-7 pt-5 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-3">
                {[['how_to_vote', 128 + mine.length, 'Aspirasi Aktif'], ['forum', 42, 'Tahap Audiensi'], ['task_alt', 89, 'Direalisasikan']].map(([ic, n, l]) => (
                  <div key={l} className="rounded-xl bg-black/15 border border-white/10 px-2.5 sm:px-4 py-3 hover:bg-black/25 transition-colors">
                    <Ic n={ic} fill className="!text-[18px] text-emerald-200" /><div className={`${go} text-lg sm:text-2xl font-bold leading-tight`}><Counter to={n} /></div><div className="text-[10px] sm:text-xs text-emerald-100/75">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={listRef} className="scroll-mt-28 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_210px_220px] gap-3">
              <div className="relative sm:col-span-2 lg:col-span-1"><Ic n="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul, fasilitas, atau kata kunci…" className={`${inputCls(false)} pl-10`} /></div>
              <Select value={st} onChange={setSt}><option value="">Semua Status</option>{Object.entries(STAT).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</Select>
              <Select value={sort} onChange={setSort}><option value="trend">Dukungan Terbanyak</option><option value="baru">Terbaru</option><option value="kuota">Mendekati Kuota</option></Select>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
              {CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`ripple shrink-0 px-4 py-2 rounded-full text-sm font-medium border active:scale-95 transition-all duration-300 ${cat === c ? 'bg-emerald-700 text-white border-emerald-700 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-800 hover:-translate-y-px'}`}>{c}</button>)}
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500"><span><b className="text-slate-900">{list.length}</b> aspirasi ditampilkan</span>{filtering && <button onClick={resetFilter} className="text-emerald-700 font-semibold hover:underline underline-offset-4 active:scale-95 transition-all">Reset filter</button>}</div>
            {list.length ? (
              <div key={`${cat}-${st}-${sort}-${q}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {list.map((a, i) => <Card key={a.id} a={a} index={i} voted={!!voted[a.id]} fresh={a.id === newId} onVote={vote} />)}
              </div>
            ) : (
              <div className="text-center py-14 bg-white border border-dashed border-slate-300 rounded-2xl"><Ic n="search_off" className="!text-[44px] text-slate-300" /><p className="mt-2 font-semibold">Tidak ada aspirasi yang cocok</p><p className="text-sm text-slate-500">Coba kata kunci lain atau tulis aspirasimu sendiri.</p><button onClick={resetFilter} className="ripple mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 active:scale-95 transition-all">Reset filter</button></div>
            )}
          </section>

          <Reveal>
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
              <div className="max-w-xl"><h2 className={`${go} text-xl sm:text-2xl font-bold`}>Punya ide atau keluhan seputar fasilitas kampus?</h2><p className="mt-2 text-sm text-slate-500 leading-relaxed">Pilih tampil <b className="text-slate-700">anonim</b> ke publik, namun tetap terverifikasi SSO ke tim Advokasi BEM.</p></div>
              <button onClick={() => setForm(true)} className="ripple shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm shadow-sm hover:bg-emerald-800 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-300"><Ic n="edit_note" fill />Tulis Aspirasi Saya</button>
            </section>
          </Reveal>

          <section id="alur" className="scroll-mt-28">
            <Reveal className="text-center max-w-2xl mx-auto mb-6"><h2 className={`${go} text-xl sm:text-2xl font-bold`}>Dari Aspirasi Menjadi Kebijakan Nyata</h2><p className="mt-2 text-sm text-slate-500">Alur advokasi terbuka, transparan, dan dapat dipantau semua civitas.</p></Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map(([ic, t, d], i) => (
                <Reveal key={t} delay={i * 80}>
                  <div className="h-full bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-[0_14px_24px_-6px_rgba(6,78,59,.14)] transition-all duration-300 group">
                    <div className="flex items-center justify-between"><div className="w-11 h-11 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300"><Ic n={ic} fill /></div><span className={`${go} text-3xl font-extrabold text-slate-200`}>{i + 1}</span></div>
                    <h3 className="mt-3 font-bold">{t}</h3><p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/60 py-6 px-4 text-center text-xs text-slate-500">© 2026 KampuSmart • Kolaborasi BEM Mahasiswa & Biro Sarana Prasarana Kampus</footer>

      <AspirasiForm open={form} onClose={() => setForm(false)} onSubmit={submit} />
      <div role="status" className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] px-4 py-2.5 rounded-full bg-slate-900 text-white text-sm shadow-xl transition-all duration-500 ${ease} ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>{toast.m}</div>
    </div>
  );
}