"use client";
import Link from "next/link";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div>
        {/* Navigation Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800/80 max-w-6xl mx-auto backdrop-blur-md sticky top-0 z-50 bg-[#0a0c14]/80">
          <Link href="/" className="flex items-center gap-1.5 font-black text-2xl tracking-tight select-none">
            <span className="text-3xl animate-pulse">👑</span>
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">TAXT</span>
            <span className="text-slate-500 text-lg">.UZ</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-400 font-medium">
            <Link href="/" className="hover:text-amber-400 transition">Reyting</Link>
            <Link href="/haqida" className="hover:text-amber-400 transition">Haqida</Link>
            <Link href="/qoidalar" className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">Qoidalar</Link>
            <span className="text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 cursor-pointer hover:border-slate-700 transition">uz <b>O'z</b></span>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 mb-8 transition group bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Reytingga qaytish
          </Link>

          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
              <span>📜</span> Ochiq Kodeks
            </div>
            
            {/* 1-VARIANT SARLAVHA */}
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 leading-tight">
              Taxt Kodeksi va <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Shaffoflik Qoidalari
              </span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl font-normal">
              Platformadagi barcha ishtirokchilar uchun teng va ochiq shartlar. Qancha yuqori stavka kiritsangiz, shuncha yuqori taxtda turasiz va ko'proq real mijozlar e'tiborini tortasiz.
            </p>
          </div>

          {/* Rules Grids */}
          <div className="space-y-8">
            
            {/* Rule Block 1 */}
            <div className="bg-slate-900/80 border border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-lg border border-amber-500/40 shrink-0">
                  1
                </span>
                <h3 className="text-xl font-extrabold text-white">Stavkalar va Reyting mexanikasi</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-300 pt-2">
                <li className="bg-[#0a0c14] border border-slate-800/80 p-4 rounded-2xl flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">▪</span>
                  <span>Eng kam boshlang'ich stavka <strong className="text-amber-400 font-bold">30 000 so'm</strong>. Minimal oshirish adami <strong className="text-amber-400 font-bold">1 000 so'm</strong>.</span>
                </li>
                <li className="bg-[#0a0c14] border border-slate-800/80 p-4 rounded-2xl flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">▪</span>
                  <span>Mavjud brend URL manzili qayta kiritilsa, to'lov joriy balansga qo'shiladi va avtomatik ravishda o'rni ko'tariladi.</span>
                </li>
                <li className="bg-[#0a0c14] border border-slate-800/80 p-4 rounded-2xl flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">▪</span>
                  <span>"O'rinni egallash" tugmasi tanlangan o'rindan o'zib ketish uchun kerakli summani aniq hisoblab beradi.</span>
                </li>
                <li className="bg-[#0a0c14] border border-slate-800/80 p-4 rounded-2xl flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">▪</span>
                  <span>Ssilkalardagi ortiqcha UTM va kuzatuv parametrlari tozalanib, reytingda asosiy domen bilan birlashtiriladi.</span>
                </li>
              </ul>
            </div>

            {/* Rule Block 2 - KAZINO VA TO'LOV QAYTARILMASLIGI */}
            <div className="bg-slate-900/80 border border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-lg border border-emerald-500/40 shrink-0">
                  2
                </span>
                <h3 className="text-xl font-extrabold text-white">Ruxsat etilgan havolalar va Cheklovlar</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 pt-2">
                <div className="bg-[#0a0c14] border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <span>🌐</span> Rasmiy Veb-saytlar
                </div>
                <div className="bg-[#0a0c14] border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <span>✈️</span> Telegram Kanal / Bot
                </div>
                <div className="bg-[#0a0c14] border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <span>📸</span> Instagram Profil
                </div>
                <div className="bg-[#0a0c14] border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <span>▶️</span> YouTube Kanallar
                </div>
                <div className="bg-[#0a0c14] border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <span>📲</span> App Store / Play Store
                </div>
                <div className="bg-[#0a0c14] border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <span>📍</span> Lokatsiya va xaritalar
                </div>
              </div>

              {/* KUChAYTIRILGAN OGOHLANTIRISh BLOKI */}
              <div className="bg-rose-500/10 border border-rose-500/40 p-4 md:p-5 rounded-2xl text-xs md:text-sm text-rose-300 flex items-start gap-3.5 mt-4">
                <span className="text-2xl shrink-0">🚫</span>
                <div className="space-y-1 leading-relaxed">
                  <span className="font-bold text-rose-200 block text-sm">Qat'iy taqiq va Moderatsiya:</span>
                  <p>
                    Firibgarlik, 18+ kontent, noqonuniy xizmatlar, qimor, kazino (1xbet, bet, bukmekerlik) va shubhali havolalar <strong className="text-white underline decoration-rose-500">ogohlantirishsiz avtomatik ravishda o'chiriladi</strong> hamda ushbu havolalar uchun <strong className="text-white underline decoration-rose-500">to'langan mablag' qaytarib berilmaydi!</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Rule Block 3 */}
            <div className="bg-slate-900/80 border border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 font-black flex items-center justify-center text-lg border border-orange-500/40 shrink-0">
                  3
                </span>
                <h3 className="text-xl font-extrabold text-white">Moderatsiya va Jonli yangilanish</h3>
              </div>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                To'lov tasdiqlanishi bilan brendingiz avtomatik ravishda jonli taxtda paydo bo'ladi va logotip o'z-o'zidan tortib olinadi. Moderatorlar platforma xavfsizligini hamda qoidalarga rioya etilishini muntazam nazorat qilib boradilar.
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
          <Link href="/haqida" className="hover:text-amber-400 transition">Haqida</Link>
          <span>•</span>
          <Link href="/qoidalar" className="text-amber-400 font-medium">Qoidalar</Link>
        </div>
        <p className="text-slate-600 text-[11px]">TAXT.UZ © 2026 — Barcha huquqlar himoyalangan</p>
      </footer>
    </div>
  );
}