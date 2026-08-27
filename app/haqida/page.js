"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between relative overflow-hidden">
      
      {/* Fonda zamonaviy nur effekti */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div>
        {/* Navigation / Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800/80 max-w-6xl mx-auto backdrop-blur-md sticky top-0 z-50 bg-[#0a0c14]/80">
          <Link href="/" className="flex items-center gap-1.5 font-black text-2xl tracking-tight select-none">
            <span className="text-3xl animate-pulse">👑</span>
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">TAXT</span>
            <span className="text-slate-500 text-lg">.UZ</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-400 font-medium">
            <Link href="/" className="hover:text-amber-400 transition">Reyting</Link>
            <Link href="/haqida" className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">Haqida</Link>
            <Link href="/qoidalar" className="hover:text-amber-400 transition">Qoidalar</Link>
            <span className="text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 cursor-pointer hover:border-slate-700 transition">uz <b>O'z</b></span>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 mb-8 transition group bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Reytingga qaytish
          </Link>

          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <span>🚀</span> HoReCa va Biznes Maydoni
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 leading-tight">
              Eski algoritmlarni <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600 bg-clip-text text-transparent">
                TAXT bilan almashtiramiz
              </span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
              Taxt.uz — subyektiv sharhlar, soxta baholar va yashirin algoritmlardan xoli bo'lgan <strong className="text-slate-200 font-bold">O'zbekistondagi birinchi jonli kimoshdi reytingi</strong>.
            </p>
          </div>

          {/* Afzalliklar kartochkalari */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-amber-500/40 p-6 rounded-3xl transition duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                ⚡
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">Shaffoflik</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tanish-bilish yoki administrator ta'siri yo'q. Faqat real takliflar va ochiq statistika.
              </p>
            </div>

            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-emerald-500/40 p-6 rounded-3xl transition duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🎯
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">Jonli Trafik</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tashrif buyuruvchilar brendingizga to'g'ridan-to'g'ri o'tishadi va har bir bosish jonli hisoblanadi.
              </p>
            </div>

            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-orange-500/40 p-6 rounded-3xl transition duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                👑
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">Taxt Boshqaruvi</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Chuqurroq natijalar va yuqori o'rinlar uchun har qanday vaqtda stavkangizni oshiring.
              </p>
            </div>
          </div>

          {/* Start Stavkasi Banneri */}
          <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/50 p-6 md:p-8 rounded-3xl mb-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">A'zo bo'lish</span>
              <h2 className="text-2xl font-black text-white">Start stavkasi: <span className="text-amber-400">30 000 so'm</span></h2>
              <p className="text-slate-400 text-xs">Kichik sarmoya bilan katta auditoriya e'tiborini qozoning.</p>
            </div>
            <Link 
              href="/" 
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black px-7 py-3.5 rounded-2xl hover:brightness-110 active:scale-95 transition shadow-lg shadow-amber-500/20 text-xs whitespace-nowrap flex items-center gap-2">
              <span>👑</span>
              <span>Taxtga chiqish</span>
            </Link>
          </div>

          {/* Ekosistema bloki */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              👑
            </div>
            <div>
              <h4 className="font-bold text-white text-base">TAXT.UZ Ecosystem</h4>
              <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                Toshkent va O'zbekistonning eng premium HoReCa brendlarini yagona ochiq maydonda birlashtiruvchi loyiha.
              </p>
            </div>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-2">
          <Link href="/" className="hover:text-amber-400 transition">Reyting</Link>
          <span>•</span>
          <Link href="/haqida" className="text-amber-400 font-medium">Haqida</Link>
          <span>•</span>
          <Link href="/qoidalar" className="hover:text-amber-400 transition">Qoidalar</Link>
        </div>
        <p className="text-slate-600 text-[11px]">TAXT.UZ © 2026 — Barcha huquqlar himoyalangan</p>
      </footer>
    </div>
  );
}