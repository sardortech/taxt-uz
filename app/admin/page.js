"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [properties, setProperties] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const ADMIN_PASSWORD = "3222";

  const fetchProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("bid", { ascending: false });
    if (data) setProperties(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Xato parol!");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Rostdan ham ushbu brendni o'chirmoqchimisiz?")) {
      await supabase.from("properties").delete().eq("id", id);
      fetchProperties();
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    let displayUrl = editingItem.url.replace("https://", "").replace("http://", "").replace("www.", "");
    if (displayUrl.length > 25) displayUrl = displayUrl.substring(0, 22) + "...";

    const { error } = await supabase
      .from("properties")
      .update({
        title: editingItem.title,
        url: editingItem.url.startsWith("http") ? editingItem.url : `https://${editingItem.url}`,
        display_url: displayUrl,
        category: editingItem.category,
        bid: Number(editingItem.bid),
        description: editingItem.description
      })
      .eq("id", editingItem.id);

    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
      setEditingItem(null);
      fetchProperties();
    }
  };

  const FormattedDate = ({ dateString }) => {
    const [formatted, setFormatted] = useState("—");

    useEffect(() => {
      if (dateString) {
        const date = new Date(dateString);
        setFormatted(
          date.toLocaleString("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        );
      }
    }, [dateString]);

    return <>{formatted}</>;
  };

  const totalRevenue = properties.reduce((sum, item) => sum + (Number(item.bid) || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center p-4 text-white font-sans">
        <form onSubmit={handleLogin} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 w-full max-w-md space-y-4">
          <h1 className="text-xl font-black text-center text-amber-400">👑 TAXT.uz Admin</h1>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Admin Paroli:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0c14] border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
              placeholder="Parolni kiriting..."
            />
          </div>
          <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl hover:bg-amber-400">
            Kirish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Yuqori Panel */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-amber-400">👑 TAXT.uz Admin Panel</h1>
            <p className="text-xs text-slate-400">Barcha brendlar, ssilkalar va to'lovlarni nazorat qilish</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition">
            Chiqish
          </button>
        </div>

        {/* Mini Monitoring Kartochkalari */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Jami To'langan</p>
              <h2 className="text-xl font-black text-emerald-400 font-mono mt-1">
                {totalRevenue.toLocaleString()} so'm
              </h2>
            </div>
            <div className="text-2xl">💰</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Faol Brendlar Soni</p>
              <h2 className="text-xl font-black text-amber-400 font-mono mt-1">
                {properties.length} ta
              </h2>
            </div>
            <div className="text-2xl">🏢</div>
          </div>
        </div>

        {/* Brendlar Jadvali */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-amber-400 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3.5">Brend Nomi va Ssilka</th>
                  <th className="p-3.5">Kategoriya</th>
                  <th className="p-3.5">To'langan</th>
                  <th className="p-3.5">Sana va Vaqt</th>
                  <th className="p-3.5">O'tishlar</th>
                  <th className="p-3.5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {properties.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white max-w-xs">
                      <div className="text-sm">{item.title}</div>
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-amber-400 font-mono text-[11px] underline block truncate">
                        {item.url}
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                        {item.category_name || item.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 text-sm font-mono">
                      {Number(item.bid).toLocaleString()} so'm
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-xs whitespace-nowrap">
                      🕒 <FormattedDate dateString={item.created_at} />
                    </td>
                    <td className="p-3.5 font-semibold text-slate-300">
                      🔥 {item.clicks || 0} ta
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition">
                        ✏️ Tahrirlash
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                        🗑️ O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* TAHRIRLASH MODAL OYNASI */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0f121d] border border-amber-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-amber-400 text-base">✏️ Obyektni Tahrirlash</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Brend Nomi:</label>
                <input 
                  type="text" 
                  value={editingItem.title} 
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Havola (URL):</label>
                <input 
                  type="text" 
                  value={editingItem.url} 
                  onChange={(e) => setEditingItem({...editingItem, url: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kategoriya:</label>
                <select 
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                  <option value="HOTEL">Hotellar</option>
                  <option value="RESTAURANT">Restoranlar</option>
                  <option value="HOSTEL">Hostellar</option>
                  <option value="DACHA">Dachalar</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">To'langan (So'm):</label>
                <input 
                  type="number" 
                  value={editingItem.bid} 
                  onChange={(e) => setEditingItem({...editingItem, bid: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Qisqacha Tavsif:</label>
                <textarea 
                  rows="2"
                  value={editingItem.description || ""} 
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full bg-[#0a0c14] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700">
                Bekor qilish
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400">
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}