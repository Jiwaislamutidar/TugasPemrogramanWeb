import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const A = ({ href, ...p }) =>
  href?.startsWith('/') ? <Link to={href} {...p} /> : <a href={href} {...p} />;

const ROUTES = { home: '/', lostFound: '/lostfound', aspirasi: '/aspirasi' };

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

const NAV = [
  { label: 'Homepage', href: ROUTES.home, active: true },
  { label: 'Lost & Found', href: ROUTES.lostFound },
  { label: 'Aspirasi', href: ROUTES.aspirasi },
];

const ASPIRASI = [
  { id: 1, cat: 'Fasilitas & Sarpras', tag: 'Keamanan & Sarpras', title: 'Revitalisasi Penerangan & Penambahan CCTV Parkiran Motor FTI', desc: 'Sering terjadi kehilangan helm dan kondisi gelap setelah pukul 18:30 WIB di lorong parkir belakang gedung. Diperlukan penambahan 6 tiang lampu LED & kamera pengawas.', votes: 840, pct: 84 },
  { id: 2, cat: 'Fasilitas & Sarpras', tag: 'Fasilitas Kampus', title: 'Penambahan Stopkontak & Akses Daya di Selasar Gedung GKB', desc: 'Tingginya aktivitas pengerjaan tugas laptop mandiri di lorong lantai 2 dan 3 menimbulkan kabel berantakan yang membahayakan lintasan pejalan kaki.', votes: 962, pct: 96 },
  { id: 3, cat: 'Akademik & Perkuliahan', tag: 'Akademik & Teknologi', badge: 'Evaluasi UPT TIK', title: 'Optimasi Bandwidth Eduroam & Hotspot Area Kantin dan Gazebo', desc: 'Sinyal WiFi sering terputus pada jam sibuk perkuliahan (11:00-14:00) yang menghambat akses materi daring dan ujian kuis responsif mahasiswa.', votes: 784, pct: 78 },
];
const CATS = ['Semua Kategori', 'Fasilitas & Sarpras', 'Akademik & Perkuliahan', 'Keamanan', 'Kesejahteraan'];

const FAQ = [
  ['key', 'Bagaimana cara menemukan barang yang hilang?', 'Tunggu orang lain menemukan dan menguhubungi melalui WhatsApp atau cek secara berkala halaman penemuan barang'],
  ['shield', 'Apakah identitas saya aman saat mengirimkan aspirasi atau keluhan fasilitas?', 'ya, identitas kamu sangat aman. karena identitas dilindungi dan hanya menginput detail barang atau pesan yang disampaikan.'],
  ['auto_awesome', 'Berapa lama proses menemukan barang?', 'Tergantung seberapa cepat orang lain menemukan barang tersebut di lingkungan kampus dan menghubungi kamu.'],
  ['help', 'Apa yang harus dilakukan jika menemukan barang milik orang lain di kelas atau koridor?', 'Foto barang, buat laporan temuan, lalu serahkan ke Pos Satpam terdekat agar pemilik dapat menghubungi dengan aman.'],
  ['account_balance', 'Bagaimana alur aspirasi mahasiswa sampai ditindaklanjuti Dekanat dan Sarpras?', 'Aspirasi yang mencapai target dukungan dibahas oleh HIMA, diteruskan ke Dekanat dan Biro Sarpras, lalu statusnya dapat dipantau di timeline.'],
];

const cardBase = 'bg-white border border-slate-200 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,.04)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_14px_24px_-6px_rgba(6,78,59,.14)] hover:-translate-y-1';
const ease = 'ease-[cubic-bezier(.22,1,.36,1)]';

export default function Homepage() {
  const navigate = useNavigate();



  const rootRef = useRef(null);
  const toastRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [cat, setCat] = useState('Semua Kategori');
  const [voted, setVoted] = useState({});
  const [faq, setFaq] = useState(null);
  const [toast, setToast] = useState({ m: '', show: false });
  const [theming, setTheming] = useState(false);
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem('ks-theme'); if (s) return s === 'dark'; } catch (e) {}
    return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  });

  const showToast = (m) => {
    setToast({ m, show: true });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  };
  const toggleTheme = () => {
    setTheming(true);
    setDark((d) => !d);
    setTimeout(() => setTheming(false), 650);
  };

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
    const onKey = (e) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => { document.body.style.overflow = loading || menu ? 'hidden' : ''; }, [loading, menu]);

  const list = ASPIRASI.filter((a) => cat === 'Semua Kategori' || a.cat === cat);
  const go = 'font-[Sora]';

  const share = async (a) => {
    try {
      if (navigator.share) await navigator.share({ title: a.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); showToast('Tautan aspirasi disalin'); }
    } catch (e) {}
  };

  return (
    <div ref={rootRef} className={`kd ${dark ? 'kd-dark' : ''} ${theming ? 'theming' : ''} isolate min-h-screen flex flex-col text-slate-900 antialiased font-['Inter'] selection:bg-emerald-200 selection:text-emerald-900`}>
      <style>{CSS}</style>
      <div className="page-bg" aria-hidden="true" />

      {/* splash atsu loading screen */}
      {loading && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 transition-opacity duration-500 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative mb-6">
            <span className="absolute inset-0 rounded-3xl bg-emerald-300/40" style={{ animation: 'pulseRing 1.6s ease-out infinite' }} />
            <div className="relative w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-2xl" style={{ animation: 'floaty 2s ease-in-out infinite' }}>
              <Ic n="radar" fill className="text-emerald-700 !text-[44px]" />
            </div>
          </div>
          <h1 className={`${go} text-3xl font-bold text-white tracking-tight`}>KampuSmart</h1>
          <p className="text-emerald-100/80 text-sm mt-1.5">Satu portal kampus terintegrasi</p>
          <div className="mt-8 w-48 h-1.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full rounded-full bg-emerald-300 anim-bar" /></div>
        </div>
      )}

      {/* ini navbar nya */}
      <div className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <header className={`nav-glass ${scrolled ? 'sc' : ''} pointer-events-auto w-full rounded-full px-2.5 sm:px-3 py-2 flex items-center justify-between gap-3`} style={{ maxWidth: scrolled ? 860 : 1040 }}>
          <A href={ROUTES.home} className="flex items-center gap-2.5 group pl-1 rounded-full">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-transform duration-300">
              <Ic n="radar" fill className="!text-[20px]" />
            </div>
            <span className={`${go} text-lg sm:text-xl font-bold text-emerald-800 tracking-tight`}>KampuSmart</span>
          </A>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((l) => (
              <A key={l.label} href={l.href} className={`px-4 py-2 rounded-full font-medium transition-all duration-300 active:scale-95 ${l.active ? 'bg-emerald-600/15 text-emerald-800 font-semibold' : 'text-slate-600 hover:bg-emerald-600/10 hover:text-emerald-800 hover:-translate-y-px'}`}>{l.label}</A>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
            <button className="ripple hidden sm:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-emerald-600/10 active:scale-95 transition-all duration-300 text-left">
              <div className="w-8 h-8 rounded-full ring-2 ring-emerald-200 bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">MR</div>
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="text-sm font-semibold">M. Rayhan S.</span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1"><Ic n="verified" fill className="!text-[12px]" />SSO Terverifikasi</span>
              </div>
            </button>
            <button aria-label="Buka menu" onClick={() => setMenu(true)} className="ripple md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-600/10 active:scale-90 transition-all">
              <Ic n="menu" className="!text-[24px]" />
            </button>
          </div>
        </header>
      </div>

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
        <section className="relative pt-28 pb-14 md:pt-40 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center text-center">
            <h1 className={`anim-up ${go} text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl`} style={{ animationDelay: '.08s' }}>
              Satu Portal Kampus <span className="text-emerald-800">Temukan Barang Berharga</span>, Suarakan Perubahan Nyata.
            </h1>

            <div className="anim-up w-full max-w-3xl mt-10 bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl shadow-emerald-900/5 text-left" style={{ animationDelay: '.18s' }}>
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><Ic n="explore" /></div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base">Pusat Navigasi & Akses Layanan Terpadu</h2>
                    <p className="text-xs sm:text-sm text-slate-500">Pilih portal tujuan atau gunakan pintasan aksi langsung di bawah ini</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />Aktif 24/7
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { href: ROUTES.lostFound, icon: 'manage_search', dark: false, title: 'Direktori Lost & Found', cta: 'Buka Direktori', desc: 'Jelajahi inventaris barang temuan di 18 pos satpam, verifikasi kecocokan AI, atau buat tiket pencarian barang hilang Anda.', mi: 'visibility', m1: 'AI Visual Match', m2: '12 Kasus Hari Ini' },
                  { href: ROUTES.aspirasi, icon: 'campaign', dark: true, title: 'Portal Aspirasi & Advokasi', cta: 'Suarakan Aspirasi', desc: 'Dukung petisi kampus, suarakan keluhan fasilitas sarpras, dan kawal realisasi aspirasi langsung ke meja audiensi Dekanat.', mi: 'account_balance', m1: 'Jalur Resmi Dekanat', m2: '3 Agenda Aktif' },
                ].map((c) => (
                  <A key={c.title} href={c.href} className="ripple group flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 active:scale-[.98] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 ${c.dark ? 'bg-emerald-900' : 'bg-emerald-700'}`}><Ic n={c.icon} fill /></div>
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">{c.cta}<Ic n="arrow_forward" className="!text-[14px] group-hover:translate-x-1.5 transition-transform duration-300" /></span>
                    </div>
                    <div>
                      <h3 className={`${go} font-bold text-lg`}>{c.title}</h3>
                      <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{c.desc}</p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 mt-auto pt-1">
                      <span className="flex items-center gap-1"><Ic n={c.mi} className="!text-[14px]" />{c.m1}</span>
                      <span className="text-slate-500">{c.m2}</span>
                    </div>
                  </A>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1"><Ic n="bolt" className="!text-[14px]" />Pintasan Cepat:</span>
                {[['fact_check', 'Cek Status Laporan'], ['map', 'Lihat Peta Pos Satpam'], ['help', 'Panduan Klaim Barang']].map(([i, t]) => (
                  <A key={t} href={ROUTES.lostFound} onClick={(e) => { e.preventDefault(); navigate(ROUTES.lostFound); }} className="ripple inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-800 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 transition-all duration-300">
                    <Ic n={i} className="!text-[15px]" />{t}
                  </A>
                ))}
              </div>
            </div>

            <div className="anim-up grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-5" style={{ animationDelay: '.28s' }}>
              {[
                { i: 'fmd_bad', c: 'bg-red-50 text-red-600', t: 'Lapor Kehilangan', d: 'Buat laporan dan tunggu orang menemukan', h: ROUTES.lostFound },
                { i: 'handshake', c: 'bg-emerald-100 text-emerald-800', t: 'Laporkan Temuan', d: 'Isi form dan tunggu pemilik menghubungi', h: ROUTES.lostFound },
                { i: 'rate_review', c: 'bg-teal-50 text-teal-700', t: 'Tulis Aspirasi Baru', d: 'Kawal suara hingga audiensi', h: ROUTES.aspirasi },
              ].map((q) => (
                <A key={q.t} href={q.h} className="ripple group p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 active:scale-[.97] transition-all duration-300 flex items-center gap-3 text-left">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 ${q.c}`}><Ic n={q.i} fill className="!text-[20px]" /></div>
                  <div><h4 className="font-semibold text-sm">{q.t}</h4><p className="text-xs text-slate-500">{q.d}</p></div>
                </A>
              ))}
            </div>
          </div>
        </section>

        {/* activity menyesuaiksn */}
        <section className="py-12 md:py-16 bg-white/60 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                </div>
                <h2 className={`${go} text-2xl md:text-3xl font-bold tracking-tight`}>Pusat Aktivitas Kampus Terkini</h2>
              </div>
              <p className="text-sm text-slate-500 max-w-md">Pembaruan langsung serah terima barang di 18 pos sekuriti dan pergerakan advokasi aspirasi mahasiswa 5 menit terakhir.</p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <Reveal>
                <div className={`${cardBase} p-5 sm:p-6 h-full flex flex-col`}>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200 mb-5">
                    <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><Ic n="inventory_2" className="!text-[20px]" /></div><h3 className="font-bold">Live Feed Pemulihan Barang</h3></div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold whitespace-nowrap">12 Kasus Hari Ini</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { i: 'badge', c: 'bg-red-50 text-red-600', b: 'DICARI', bc: 'bg-red-100 text-red-700', t: '10 menit lalu', n: 'Kartu Tanda Mahasiswa (KTM) Budi Santoso', l: 'location_on', ld: 'Terakhir terlihat di Kantin Pusat GKB', ai: 'AI Match: 92%', a: 'Lihat Detail' },
                      { i: 'key', c: 'bg-emerald-100 text-emerald-800', b: 'DI POS SATPAM', bc: 'bg-emerald-100 text-emerald-800', t: '35 menit lalu', n: 'Kunci Kontak Honda Vario Hitam (Gantungan Biru)', l: 'shield', ld: 'Disimpan di Pos Satpam Gerbang Utama', ai: 'AI Match: 98%', a: 'Klaim Hak Milik' },
                      { i: 'laptop_mac', c: 'bg-slate-100 text-slate-600', b: 'TERVERIFIKASI & DIKEMBALIKAN', bc: 'bg-emerald-100 text-emerald-800', t: '1 jam lalu', n: 'Laptop ASUS Vivobook 14 Grey', l: 'location_on', ld: 'Diserahkan ke Mahasiswa Informatika (NIM 21xxx)', ai: 'Selesai 100%', a: 'Berita Acara #882' },
                    ].map((f) => (
                      <div key={f.n} className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 hover:translate-x-1 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${f.c}`}><Ic n={f.i} /></div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.bc}`}>{f.b}</span><span className="text-xs text-slate-400">{f.t}</span></div>
                            <h4 className="text-sm font-semibold mt-1">{f.n}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Ic n={f.l} className="!text-[15px]" />{f.ld}</p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                          <span className="text-xs px-2 py-1 rounded-md bg-teal-50 text-teal-700 font-bold flex items-center gap-1"><Ic n="psychology" className="!text-[14px]" />{f.ai}</span>
                          <A href={ROUTES.lostFound} onClick={(e) => { e.preventDefault(); navigate(ROUTES.lostFound); }} className="text-xs text-emerald-700 font-semibold hover:underline underline-offset-4 active:scale-95 transition">{f.a}</A>
                        </div>
                      </div>
                    ))}
                  </div>
                  <A href={ROUTES.lostFound} onClick={(e) => { e.preventDefault(); navigate(ROUTES.lostFound); }} className="group mt-auto pt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-700 active:scale-95 transition">
                    Buka Seluruh Direktori Temuan Barang<Ic n="north_east" className="!text-[16px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </A>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className={`${cardBase} p-5 sm:p-6 h-full flex flex-col`}>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200 mb-5">
                    <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center"><Ic n="campaign" className="!text-[20px]" /></div><h3 className="font-bold">Aktivitas Aspirasi & Respons Kampus</h3></div>
                    <span className="hidden sm:inline text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold whitespace-nowrap">Tindak Lanjut Dekanat</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { b: 'AUDIENSI JUMAT INI', bc: 'bg-emerald-100 text-emerald-800', t: 'Update 12 menit lalu', n: 'Pengadaan Kursi Baca Ergonomis Perpustakaan Lt. 3', d: 'Didukung 420+ mahasiswa. BEM & Kepala Perpustakaan menjadwalkan pembahasan spesifikasi Jumat, 10:00 WIB.', foot: [['groups', '428 Mahasiswa Mendukung'], ['', 'Target 500 Suara']] },
                      { b: 'DISETUJUI DEKANAT', bc: 'bg-emerald-100 text-emerald-800', t: 'Hari ini 09:30', n: 'Penerangan LED & CCTV Baru di Parkiran Barat', d: 'Surat Keputusan Sarpras No. 41/SP/2025 telah diterbitkan. Tim teknis memulai instalasi kabel lampu 75% selesai.', bar: 75 },
                      { b: 'PROSES TENDER BIRO SARPRAS', bc: 'bg-amber-100 text-amber-700', t: 'Kemarin', n: 'Instalasi Stasiun Refill Air Minum Higienis GKB', d: 'Pengujian kualitas air numur bor telah disetujui lab teknik lingkungan. Vendor water dispenser tahap final.', foot: [['account_balance', 'Biro Sarpras Kampus'], ['', 'Pantau Milestone']] },
                    ].map((s) => (
                      <div key={s.n} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 hover:translate-x-1 transition-all duration-300">
                        <div className="flex items-center justify-between gap-2 mb-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.bc}`}>{s.b}</span><span className="text-xs text-slate-400">{s.t}</span></div>
                        <h4 className="text-sm font-semibold">{s.n}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.d}</p>
                        {s.bar && (<div className="mt-3 flex items-center gap-3"><div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${s.bar}%` }} /></div><span className="text-xs font-bold text-emerald-700">{s.bar}% Pengerjaan</span></div>)}
                        {s.foot && (<div className="mt-3 flex items-center justify-between text-xs font-semibold"><span className="text-emerald-700 flex items-center gap-1">{s.foot[0][0] && <Ic n={s.foot[0][0]} className="!text-[15px]" />}{s.foot[0][1]}</span><span className="text-slate-500">{s.foot[1][1]}</span></div>)}
                      </div>
                    ))}
                  </div>
                  <A href={ROUTES.aspirasi} className="group mt-auto pt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-700 active:scale-95 transition">
                    Buka Seluruh Aspirasi Terbuka<Ic n="north_east" className="!text-[16px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </A>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-8">
              <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-700 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6 text-white shadow-lg">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Ic n="notifications_active" /></div>
                  <div>
                    <h3 className={`${go} text-xl font-bold`}>Kehilangan atau menemukan barang berharga di area kampus?</h3>
                    <p className="text-emerald-100/85 text-sm mt-1.5">Segera buat laporan resmi untuk dicocokkan otomatis oleh AI Match dan disinkronkan secara langsung ke inventaris seluruh pos satpam kampus.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <A href={ROUTES.lostFound} onClick={(e) => { e.preventDefault(); navigate(ROUTES.lostFound); }} className="ripple inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 text-emerald-950 font-semibold text-sm hover:bg-emerald-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[.97] transition-all duration-300"><Ic n="add_circle" fill className="!text-[18px]" />Laporkan barang mu yang hilang</A>
                  <A href={ROUTES.lostFound} onClick={(e) => { e.preventDefault(); navigate(ROUTES.lostFound); }} className="ripple inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 hover:-translate-y-0.5 active:scale-[.97] transition-all duration-300">Laporkan barang yang ditemukan</A>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* aspirasi */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
              <div className="max-w-xl">
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold">Aspirasi Mahasiswa</span>
                <h2 className={`${go} text-2xl md:text-3xl font-bold tracking-tight mt-1`}>Suara Mahasiswa Berdampak</h2>
                <p className="text-sm text-slate-500 mt-2">Aspirasi mahasiswa dengan dukungan komunitas tertinggi akan diteruskan secara resmi ke Biro Sarana Prasarana dan Dekanat melalui BEM.</p>
              </div>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full [scrollbar-width:none]">
                {CATS.map((c) => (
                  <button key={c} onClick={() => setCat(c)} className={`ripple px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap active:scale-95 transition-all duration-300 ${cat === c ? 'bg-white text-emerald-800 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}>{c}</button>
                ))}
              </div>
            </Reveal>

            {list.length ? (
              <div key={cat} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((a, i) => {
                  const on = !!voted[a.id];
                  const count = a.votes + (on ? 1 : 0);
                  return (
                    <div key={a.id} className="anim-up" style={{ animationDelay: `${i * 90}ms` }}>
                      <article className={`${cardBase} p-5 flex flex-col gap-4 h-full`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">{a.tag}</span>
                          {a.badge && <span className="text-[10px] font-bold uppercase text-emerald-700">{a.badge}</span>}
                        </div>
                        <h3 className={`${go} font-bold text-lg leading-snug`}>{a.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{a.desc}</p>
                        <div className="mt-auto">
                          <div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-slate-500">Dukungan: {count.toLocaleString('id-ID')} dari 1.000 Suara</span><span className="text-emerald-700">{a.pct}%</span></div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-emerald-700 transition-all duration-1000" style={{ width: `${a.pct + (on ? 0.1 : 0)}%` }} /></div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <button onClick={() => { setVoted((v) => ({ ...v, [a.id]: !v[a.id] })); showToast(on ? 'Dukungan dibatalkan' : 'Dukunganmu berhasil dicatat'); }} aria-pressed={on}
                            className={`ripple inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-300 ${on ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            <Ic n="thumb_up" fill={on} className={`!text-[18px] transition-transform duration-300 ${on ? '-rotate-12 scale-110' : ''}`} />Dukung Suara <b key={count} className="pop inline-block">{count.toLocaleString('id-ID')}</b>
                          </button>
                          <button aria-label="Bagikan" onClick={() => share(a)} className="ripple p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-emerald-700 hover:rotate-12 active:scale-90 transition-all duration-300"><Ic n="share" className="!text-[20px]" /></button>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div key={cat} className="anim-up text-center py-14 rounded-2xl border border-dashed border-slate-300 bg-white/60">
                <Ic n="inbox" className="!text-[40px] text-slate-300" />
                <p className="font-semibold mt-2">Belum ada aspirasi di kategori ini</p>
                <A href={ROUTES.aspirasi} className="inline-block mt-3 text-sm font-semibold text-emerald-700 hover:underline underline-offset-4 active:scale-95 transition">Jadilah yang pertama menulis aspirasi</A>
              </div>
            )}

            <Reveal className="mt-8">
              <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-700 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 text-white">
                <div>
                  <h3 className={`${go} text-xl font-bold`}>Punya usulan atau keresahan terkait fasilitas kampus atau hal lain?</h3>
                  <p className="text-emerald-100/85 text-sm mt-1.5 max-w-2xl">Setiap mahasiswa aktif memiliki hak advokasi. Kami menjamin kerahasiaan identitas dan mengawal aspirasi hingga tindak lanjut audiensi dekanat.</p>
                </div>
                <A href={ROUTES.aspirasi} className="ripple inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-emerald-800 font-semibold text-sm whitespace-nowrap hover:bg-emerald-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[.97] transition-all duration-300">Mulai Buat Aspirasi Baru</A>
              </div>
            </Reveal>
          </div>
        </section>

        {/* buat car akerja */}
        <section className="py-12 md:py-16 bg-white/60 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <Reveal className="text-center max-w-2xl mx-auto mb-10">
              <h2 className={`${go} text-2xl md:text-3xl font-bold tracking-tight mt-1`}>Bagaimana KampuSmart Mengembalikan Barang Anda</h2>
              <p className="text-sm text-slate-500 mt-2">Hubungkan laporanmu dengan pos satpam kampus.</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                ['01', 'Buat Laporan dalam 2 Menit', 'Cukup unggah foto barang, deskripsikan ciri khusus atau nomor registrasi, serta pilih estimasi waktu & lokasi terakhir barang terlihat.', 'cloud_upload', 'Cepat dan Mudah'],
                ['02', 'Tunggu orang menghubungi mu', 'apapun yang kamu laporkan, silahkan tunggu hingga pemilik atau penemu menghubungi mu', 'auto_awesome', 'Pantau Pesan WhatsApp'],
                ['03', 'Serah Terima Sesuai Kesepakatan kamu', 'Hubungi pemilik atau penemu melalui WhatsApp dan tentukan titik dan waktu temu untuk serah terima', 'verified_user', 'Prosedur Aman Selama di Lingkungan Kampus'],
              ].map(([n, t, d, i, f], k) => (
                <Reveal key={n} delay={k * 100}>
                  <div className={`${cardBase} group p-6 h-full flex flex-col`}>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold font-[Sora] mb-4 group-hover:bg-emerald-700 group-hover:text-white group-hover:scale-110 transition-all duration-300">{n}</div>
                    <h3 className={`${go} font-bold text-lg`}>{t}</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">{d}</p>
                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><Ic n={i} className="!text-[16px]" />{f}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ala ala statistik */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <Reveal>
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 text-center">
                <h2 className={`${go} text-2xl md:text-3xl font-bold tracking-tight`}>Dampak Nyata & Akuntabilitas Terbuka</h2>
                <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">Statistik agregat real-time seluruh aktivitas operasional perlindungan barang dan advokasi mahasiswa tahun akademik 2024/2025.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  {[
                    ['inventory_2', 100, '+', 'Barang Dikembalikan', '96% Success Rate Temuan'],
                    ['how_to_vote', 50, '+', 'Aspirasi Terkirim', 'Dibaca Oleh Sarpras'],
                    ['verified', 24000, '+', 'Mahasiswa Unpam Menggunakan', 'Pengguna Aktif Terverifikasi'],
                  ].map(([i, n, s, l, sub]) => (
                    <div key={l} className="group p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <Ic n={i} fill className="text-emerald-700 !text-[22px] group-hover:scale-125 transition-transform duration-300" />
                      <div className={`${go} text-4xl sm:text-5xl font-extrabold text-emerald-800 mt-2`}><Counter to={n} suffix={s} /></div>
                      <div className="text-sm font-semibold mt-2">{l}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 bg-white/60 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-8">
            <Reveal className="text-center mb-8">
              <h2 className={`${go} text-2xl md:text-3xl font-bold tracking-tight mt-3`}>Pertanyaan yang Sering Diajukan (FAQ)</h2>
              <p className="text-sm text-slate-500 mt-2">Kumpulan panduan praktis dan jawaban resmi seputar penanganan barang hilang dan advokasi suara kampus.</p>
            </Reveal>
            <div className="space-y-3">
              {FAQ.map(([i, q, a], k) => {
                const open = faq === k;
                return (
                  <div key={q} className={`rounded-2xl border bg-white transition-all duration-500 ${open ? 'border-emerald-400 shadow-lg' : 'border-slate-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5'}`}>
                    <button onClick={() => setFaq(open ? null : k)} aria-expanded={open} className="ripple w-full flex items-center gap-3 p-4 sm:p-5 text-left rounded-2xl active:scale-[.99] transition-transform">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 ${open ? 'bg-emerald-700 text-white rotate-[360deg]' : 'bg-emerald-50 text-emerald-700'}`}><Ic n={i} className="!text-[20px]" /></div>
                      <span className={`${go} flex-1 font-semibold text-sm sm:text-base`}>{q}</span>
                      <Ic n="expand_more" className={`text-slate-400 transition-transform duration-500 ${ease} ${open ? 'rotate-180 text-emerald-700' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-500 ${ease} ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className={`px-5 pb-5 sm:pl-[4.25rem] text-sm text-slate-500 leading-relaxed transition-all duration-500 ${open ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 -translate-y-2'}`}>{a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center"><Ic n="radar" fill className="!text-[18px]" /></div><span className={`${go} font-bold text-emerald-800 text-lg`}>KampusFind</span></div>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">© 2025 KampusFind Digital Ecosystem. Kolaborasi Resmi BEM & Biro Sarana Prasarana Kampus.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            {['Panduan Verifikasi AI', 'Etika Advokasi', 'Daftar Pos Keamanan', 'Kebijakan Privasi SSO', 'Kontak Satpam & Dekanat'].map((t) => (
              <A key={t} href="#" className="hover:text-emerald-700 hover:-translate-y-px underline-offset-4 hover:underline active:scale-95 transition-all duration-300">{t}</A>
            ))}
          </nav>
        </div>
      </footer>

      {/* button biar balik ke atas */}
      <button aria-label="Kembali ke atas" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`ripple fixed bottom-6 left-10 z-40 w-12 h-12 rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-xl active:scale-90 transition-all duration-500 ${ease} ${showTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75 pointer-events-none'}`}>
        <Ic n="arrow_upward" />
      </button>

      <div role="status" aria-live="polite" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-full bg-emerald-900 text-white text-sm font-medium shadow-2xl flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] ${toast.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-90 pointer-events-none'}`}>
        <Ic n="check_circle" fill className="text-emerald-300 !text-[18px]" />{toast.m}
      </div>
    </div>
  );
}