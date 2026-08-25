"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeRankFilter, setActiveRankFilter] = useState("ALL"); // Top-3, Top-10, va h.k. uchun
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Home pagedagi interaktiv stavka
  const [top1Bid, setTop1Bid] = useState(30000);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "HOTEL",
    description: "",
    bidAmount: 30000,
    paymentMethod: "click"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Supabase'dan ma'lumotlarni yuklab olish
  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("bid", { ascending: false })
      .order("created_at", { ascending: true });

    if (!error && data) {
      const formatted = data.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
      setProperties(formatted);

      if (formatted.length > 0) {
        const maxBid = formatted[0].bid;
        const defaultTop = maxBid >= 30000 ? maxBid + 1000 : 30000;
        setTop1Bid(defaultTop);
      } else {
        setTop1Bid(30000);
      }
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleLinkClick = async (id, currentClicks) => {
    setProperties(prevProps =>
      prevProps.map(item =>
        item.id === id ? { ...item, clicks: (item.clicks || 0) + 1 } : item
      )
    );

    await supabase
      .from("properties")
      .update({ clicks: (currentClicks || 0) + 1 })
      .eq("id", id);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  // Kategoriya va Top o'rinlar bo'yicha filtrlash
  const filteredProperties = properties
    .filter(p => activeTab === "ALL" || p.category === activeTab)
    .filter(p => {
      if (activeRankFilter === "TOP3") return p.rank <= 3;
      if (activeRankFilter === "TOP10") return p.rank <= 10;
      if (activeRankFilter === "TOP20") return p.rank <= 20;
      if (activeRankFilter === "TOP30") return p.rank <= 30;
      if (activeRankFilter === "TOP100") return p.rank <= 100;
      return true;
    });

  const calculateEstimatedRank = (amount) => {
    const numericAmount = Number(amount) || 0;
    
    if (properties.length === 0) {
      return { rank: 1, text: "#1-o'rin (Taxt EGASI 👑)", isTop: true };
    }

    if (numericAmount > properties[0].bid) {
      return { rank: 1, text: "#1-o'rin (Taxt EGASI 👑)", isTop: true };
    }
    
    let rank = 1;
    for (let i = 0; i < properties.length; i++) {
      if (properties[i].bid >= numericAmount) {
        rank = i + 2;
      } else {
        break;
      }
    }

    const isTop = rank === 1;
    const text = isTop ? "#1-o'rin (Taxt EGASI 👑)" : `#${rank}-o'rin`;
    return { rank, text, isTop };
  };

  const homeEstimatedRank = calculateEstimatedRank(top1Bid);
  const modalEstimatedRank = calculateEstimatedRank(formData.bidAmount);

  const requiredForTop1 = properties.length > 0 ? (properties[0].bid + 1000) : 30000;

  // Social Proof ko'rsatkichlari (Pulsiz)
  const totalClicks = properties.reduce((acc, curr) => acc + Number(curr.clicks || 0), 0);
  const top100Count = Math.min(properties.length, 100);

  const openClaimModal = (targetAmount = top1Bid) => {
    const finalAmount = Math.max(30000, Number(targetAmount) || 30000);
    setFormData(prev => ({ ...prev, bidAmount: finalAmount }));
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!formData.title || !formData.url) {
      alert("Iltimos, brend nomi va ssilkasini kiriting!");
      return;
    }

    if (formData.bidAmount < 30000) {
      alert("Minimal to'lov summasi 30,000 so'm!");
      return;
    }

    const categoryNames = {
      HOTEL: "Mehmonxonalar",
      RESTAURANT: "Restoranlar",
      HOSTEL: "Hostellar",
      DACHA: "Dachalar"
    };

    const categoryLogos = {
      HOTEL: "🏨",
      RESTAURANT: "🍽️",
      HOSTEL: "🛏️",
      DACHA: "🏡"
    };

    let displayUrl = formData.url.replace("https://", "").replace("http://", "").replace("www.", "");
    if (displayUrl.length > 25) displayUrl = displayUrl.substring(0, 22) + "...";

    const { error } = await supabase.from("properties").insert([
      {
        title: formData.title,
        description: formData.description,
        url: formData.url.startsWith("http") ? formData.url : `https://${formData.url}`,
        display_url: displayUrl,
        category: formData.category,
        category_name: categoryNames[formData.category] || "Boshqa",
        bid: Number(formData.bidAmount),
        clicks: 0,
        logo: categoryLogos[formData.category] || "🏢"
      }
    ]);

    if (error) {
      alert("Xatolik yuz berdi: " + error.message);
    } else {
      alert(`To'lov muvaffaqiyatli! Brendingiz saqlandi.`);
      setIsModalOpen(false);
      setFormData({
        title: "",
        url: "",
        category: "HOTEL",
        description: "",
        bidAmount: 30000,
        paymentMethod: "click"
      });
      fetchProperties();
    }
  };

  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl animate-bounce">👑</div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-amber-200">
            #1
          </div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">🥈</div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md border border-slate-200">
            #2
          </div>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">🥉</div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-amber-200 font-black text-base flex items-center justify-center shadow-md border border-amber-600/50">
            #3
          </div>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 font-bold text-sm flex items-center justify-center">
        #{rank}
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800/80 max-w-6xl mx-auto backdrop-blur-md sticky top-0 z-40 bg-[#0a0c14]/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-black text-2xl tracking-tight cursor-pointer select-none">
              <span className="text-3xl">👑</span>
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">TAXT</span>
              <span className="text-slate-500 text-lg">.UZ</span>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm text-slate-400 font-medium">
            <a href="#" className="hover:text-amber-400 transition cursor-pointer">Reyting</a>
            <a href="#" className="hover:text-amber-400 transition cursor-pointer">Haqida</a>
            <a href="#" className="hover:text-amber-400 transition cursor-pointer">Qoidalar</a>
            <span className="text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 cursor-pointer hover:border-slate-700 transition">uz <b>O'z</b></span>
          </nav>
        </header>

        {/* Main Container */}
        <main className="max-w-4xl mx-auto px-4 py-10">
          
          <div className="flex justify-center mb-6">
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full text-xs text-slate-400 flex items-center gap-2 shadow-xl cursor-default">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span><strong className="text-white">92 onlayn</strong> · 19 800+ real tashrif buyuruvchilar</span>
            </div>
          </div>

          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight">
              HoReCa Taxti — O'z brendingizni cho'qqiga olib chiqing!
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Toshkentdagi eng mashhur maskanlarning jonli kimoshdi reytingi.
            </p>
          </div>

          {/* Interactive Calculator */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl mb-8 space-y-4 shadow-xl">
            <div className="flex justify-between items-center text-xs text-slate-400 max-w-md mx-auto px-1">
              <span>Standart #1-o'rin summasi:</span>
              <span className="text-amber-400 font-bold">{requiredForTop1.toLocaleString("uz-UZ")} so'm</span>
            </div>

            <div className="flex items-center justify-center gap-2 md:gap-3 max-w-md mx-auto">
              <button 
                onClick={() => setTop1Bid(prev => Math.max(30000, (Number(prev) || 30000) - 1000))}
                className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center text-2xl font-bold hover:bg-amber-500 hover:text-slate-950 active:scale-95 transition cursor-pointer shadow-md shrink-0">
                –
              </button>
              
              <div className="relative w-full">
                <input 
                  type="number"
                  step="1000"
                  min="30000"
                  value={top1Bid}
                  onChange={(e) => setTop1Bid(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-[#0a0c14] border border-amber-500/50 rounded-2xl pl-4 pr-16 py-3 text-center text-2xl md:text-3xl font-black text-amber-400 focus:outline-none focus:border-amber-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-slate-400 font-bold pointer-events-none">so'm</span>
              </div>

              <button 
                onClick={() => setTop1Bid(prev => (Number(prev) || 30000) + 1000)}
                className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center text-2xl font-bold hover:bg-amber-500 hover:text-slate-950 active:scale-95 transition cursor-pointer shadow-md shrink-0">
                +
              </button>
            </div>

            <div className={`max-w-md mx-auto p-3 rounded-xl border text-xs flex items-center justify-between transition ${
              homeEstimatedRank.isTop 
                ? "bg-amber-500/15 border-amber-500/60 text-amber-300 font-bold" 
                : "bg-slate-800/60 border-slate-700/60 text-slate-300"
            }`}>
              <span>Ushbu summa bo'yicha taxminiy o'rin:</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                homeEstimatedRank.isTop ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30" : "bg-slate-700 text-white"
              }`}>
                {homeEstimatedRank.text}
              </span>
            </div>
          </div>

          {/* Action Banner */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row gap-3 shadow-2xl mb-8 items-center justify-between">
            <div className="text-slate-300 text-sm px-2 text-center md:text-left">
              🚀 O'z brendingizni qo'shing va yangi mijozlar oqimiga ega bo'ling!
            </div>
            <button 
              onClick={() => openClaimModal(top1Bid)}
              className="w-full md:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-slate-950 font-black px-8 py-3.5 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/20 text-sm whitespace-nowrap flex items-center justify-center gap-2">
              <span>👑</span>
              <span>Taxtni Egallash ({homeEstimatedRank.text})</span>
            </button>
          </div>

          {/* Kategoriya va Top-O'rinlar Filtrlari */}
          <div className="space-y-3 mb-6">
            {/* Top joylashuv tugmalari (Top-3, Top-10 va h.k.) */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider">O'rinlar:</span>
              {[
                { id: "ALL", label: "Barcha reyting" },
                { id: "TOP3", label: "Top-3 👑" },
                { id: "TOP10", label: "Top-10" },
                { id: "TOP20", label: "Top-20" },
                { id: "TOP30", label: "Top-30" },
                { id: "TOP100", label: "Top-100" },
              ].map(rank => (
                <button
                  key={rank.id}
                  onClick={() => setActiveRankFilter(rank.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                    activeRankFilter === rank.id
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}>
                  {rank.label}
                </button>
              ))}
            </div>

            {/* Kategoriya tugmalari */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "ALL", label: "Barchasi", icon: "🔥" },
                { id: "HOTEL", label: "Hotellar", icon: "🏨" },
                { id: "RESTAURANT", label: "Restoranlar", icon: "🍽️" },
                { id: "HOSTEL", label: "Hostellar", icon: "🛏️" },
                { id: "DACHA", label: "Dachalar", icon: "🏡" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 border ${
                    activeTab === tab.id 
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20" 
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/80"
                  }`}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Cards */}
          <div className="space-y-4 mb-16">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((item) => (
                <div key={item.id}>
                  <div className={`p-5 rounded-2xl border transition duration-200 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    item.rank === 1 
                      ? "bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/80 shadow-2xl shadow-amber-500/10 hover:border-amber-400" 
                      : item.rank === 2
                      ? "bg-gradient-to-r from-slate-400/10 via-slate-900 to-slate-900 border-slate-500/60 hover:border-slate-400"
                      : item.rank === 3
                      ? "bg-gradient-to-r from-amber-800/20 via-slate-900 to-slate-900 border-amber-700/50 hover:border-amber-600"
                      : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                  }`}>
                    
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        {renderRankBadge(item.rank)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xl">{item.logo}</span>
                          <h3 className="font-bold text-base md:text-lg text-white">
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-lg leading-snug">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5">
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => handleLinkClick(item.id, item.clicks)}
                            className="text-amber-400 hover:text-amber-300 active:text-amber-500 underline font-mono flex items-center gap-1 font-medium transition cursor-pointer">
                            <span>{item.display_url || item.url}</span>
                            <span className="text-[10px]">↗</span>
                          </a>
                          
                          <span>•</span>
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">{item.category_name || item.category}</span>
                          <span>•</span>
                          
                          <span className="text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 select-none">
                            <span>🔥</span> {item.clicks || 0} ta o'tish
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex md:flex-col justify-between items-end gap-2 border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0 shrink-0">
                      <div className="text-right">
                        <span className="text-base md:text-xl font-black text-amber-400">
                          {Number(item.bid).toLocaleString("uz-UZ")} so'm
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 w-full md:w-auto">
                        <button 
                          onClick={() => openClaimModal(item.bid + 1000)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap shadow-md shadow-amber-500/10">
                          O'rinni egallash
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-900/40 border border-slate-800/60 rounded-2xl text-slate-500 text-sm">
                Ushbu filtr bo'yicha hech qanday brend topilmadi.
              </div>
            )}
          </div>

          {/* Pul o'rniga yangilangan Statistika va Nufuz Bloki */}
          <div className="pt-8 border-t border-slate-800/80 text-center">
            <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-md max-w-2xl mx-auto">
              <h3 className="text-base font-bold text-slate-200 mb-6 flex items-center justify-center gap-2">
                <span>⚡</span>
                <span>TAXT.UZ Jonli Aktivligi</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-[#0a0c14] border border-slate-800/80 p-4 rounded-2xl">
                  <div className="text-2xl font-black text-amber-400">{properties.length} ta</div>
                  <div className="text-xs text-slate-400 mt-1">Faol brendlar</div>
                </div>

                <div className="bg-[#0a0c14] border border-slate-800/80 p-4 rounded-2xl">
                  <div className="text-2xl font-black text-emerald-400">{totalClicks.toLocaleString("uz-UZ")}</div>
                  <div className="text-xs text-slate-400 mt-1">Jami yo'naltirilgan o'tishlar</div>
                </div>

                <div className="bg-[#0a0c14] border border-slate-800/80 p-4 rounded-2xl">
                  <div className="text-2xl font-black text-orange-400">{top100Count} / 100</div>
                  <div className="text-xs text-slate-400 mt-1">Band etilgan top-o'rinlar</div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-5">
                Taxt joylari jonli ravishda kimoshdi savdosi asosida o'zgarib boradi.
              </p>
            </div>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-2">
          <a href="#" className="hover:text-amber-400 transition">Haqida</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-400 transition">Qoidalar</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-400 transition">Oferta</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-400 transition">Jonli statistika</a>
        </div>
        <p className="text-slate-600 text-[11px]">TAXT.UZ © 2026 — Barcha huquqlar himoyalangan</p>
      </footer>

      {/* Pop-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
          <div className="bg-[#0f121d] border border-amber-500/40 w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl relative text-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 md:p-6 border-b border-slate-800/80 text-center relative shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white active:scale-90 bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-base transition cursor-pointer">
                ✕
              </button>
              <span className="text-2xl">👑</span>
              <h2 className="text-xl md:text-2xl font-black text-white">Taxtni Egallash</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Brend ma'lumotlarini kiriting va reytingdagi o'rnigizni band qiling.
              </p>
            </div>

            <div className="p-5 md:p-6 space-y-4 text-left overflow-y-auto grow">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Brend nomi <span className="text-amber-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="Masalan: Hyatt Regency Tashkent"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Havola / Ssilka <span className="text-amber-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="Sayt, Telegram yoki Instagram ssilkasi"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Kategoriya <span className="text-amber-500">*</span>
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition cursor-pointer">
                  <option value="HOTEL">Mehmonxona</option>
                  <option value="RESTAURANT">Restoran</option>
                  <option value="HOSTEL">Hostel</option>
                  <option value="DACHA">Dacha</option>
                </select>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">To'lov summasi (so'm)</span>
                  <span className="text-slate-400">
                    #1-o'rin uchun: <strong className="text-amber-400">{requiredForTop1.toLocaleString("uz-UZ")} so'm</strong> kerak
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, bidAmount: Math.max(30000, Number(p.bidAmount) - 1000) }))}
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 active:scale-95 transition cursor-pointer flex items-center justify-center text-lg shrink-0">
                    –
                  </button>
                  <div className="relative w-full">
                    <input 
                      type="number"
                      step="1000"
                      min="30000"
                      value={formData.bidAmount}
                      onChange={(e) => setFormData({...formData, bidAmount: e.target.value === "" ? "" : Number(e.target.value)})}
                      className="w-full bg-[#0a0c14] border border-amber-500/50 rounded-xl pl-3 pr-14 py-2 text-center text-lg font-black text-amber-400 focus:outline-none focus:border-amber-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">so'm</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, bidAmount: (Number(p.bidAmount) || 30000) + 1000 }))}
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 active:scale-95 transition cursor-pointer flex items-center justify-center text-lg shrink-0">
                    +
                  </button>
                </div>

                <div className={`p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                  modalEstimatedRank.isTop 
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-300 font-bold" 
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300"
                }`}>
                  <span>Kiritilgan summa bo'yicha taxminiy o'rin:</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                    modalEstimatedRank.isTop ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30" : "bg-slate-700 text-white"
                  }`}>
                    {modalEstimatedRank.text}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Qisqacha tavsif
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">(Ixtiyoriy)</span>
                </div>
                <textarea 
                  rows="2"
                  placeholder="Brendingiz haqida 1-2 ta jozibali gap"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  To'lov tizimi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "click", name: "Click", color: "from-blue-600 to-blue-800" },
                    { id: "payme", name: "Payme", color: "from-teal-500 to-cyan-700" },
                    { id: "uzum", name: "Uzum", color: "from-purple-600 to-indigo-800" },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setFormData({...formData, paymentMethod: pay.id})}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 flex items-center justify-center gap-1 ${
                        formData.paymentMethod === pay.id 
                          ? `bg-gradient-to-r ${pay.color} text-white border-white shadow-md` 
                          : "bg-[#0a0c14] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                      }`}>
                      <span>{pay.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 md:p-6 border-t border-slate-800/80 shrink-0 bg-[#0f121d]">
              <button 
                onClick={handlePaymentSubmit}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-slate-950 font-black py-3.5 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/20 text-sm tracking-wide flex items-center justify-center gap-2">
                <span>To'lash</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}