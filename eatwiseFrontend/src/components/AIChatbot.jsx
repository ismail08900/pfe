import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, CalendarPlus } from "lucide-react";
import api from "../api";

const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const MEALS = [
  { key: "breakfast", label: "🌅 Petit-déjeuner" },
  { key: "lunch",     label: "☀️ Déjeuner" },
  { key: "dinner",    label: "🌙 Dîner" },
  { key: "snack",     label: "🍎 Collation" },
];

// Detect if a message contains a meal proposal
function extractMealFromText(text) {
  // Look for lines with meal name patterns (bold text in markdown)
  const boldMatch = text.match(/\*\*([^*]{5,60})\*\*/);
  if (boldMatch) return boldMatch[1].replace(/[🍗🌱🌾🫑🐟🍠🥦🥗]/g, "").trim();
  // Fallback: first meaningful line
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 5 && !l.startsWith("#") && !l.startsWith("*"));
  return lines[0] ? lines[0].substring(0, 60) : "Repas proposé";
}

function hasMealProposal(text) {
  const keywords = ["déjeuner", "dîner", "petit-déjeuner", "repas", "salade", "poulet", "saumon", "porridge", "assiette", "menu", "recette"];
  return keywords.some(k => text.toLowerCase().includes(k));
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "model", text: "Bonjour ! Je suis votre diététicien IA 🥗\nDemandez-moi de vous proposer un repas et je pourrai l'ajouter directement à votre planning !" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Modal state
  const [modal, setModal] = useState({ open: false, mealName: "", day: "lundi", mealType: "lunch" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const openModal = (mealName) => {
    setModal({ open: true, mealName, day: "lundi", mealType: "lunch" });
  };

  const handleAddToPlanning = async () => {
    const { mealName, day, mealType } = modal;
    setModal(m => ({ ...m, open: false }));
    setIsLoading(true);

    try {
      const res = await api.get("/planning");
      let currentPlanning = {};
      const weekStart = res.data.week_start;

      if (res.data.week) currentPlanning = res.data.week;
      else if (res.data.planning?.week) currentPlanning = res.data.planning.week;
      else if (res.data.planning) currentPlanning = res.data.planning;

      const newPlanning = { ...currentPlanning };
      if (!newPlanning[day]) newPlanning[day] = {};

      newPlanning[day][mealType] = {
        id: "ai_" + Date.now(),
        title: mealName,
        calories: 400,
        protein: 25,
        carbs: 40,
        fat: 15,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
      };

      await api.post("/planning", { week_start: weekStart, planning: newPlanning });

      setMessages(prev => [...prev, {
        sender: "model",
        text: `✅ **${mealName}** a été ajouté à votre planning du **${day}** (${MEALS.find(m => m.key === mealType)?.label}) !`
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "model", text: "❌ Erreur lors de l'ajout au planning." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .slice(1)
        .filter(m => m.text?.trim())
        .map(m => ({ sender: m.sender, text: m.text }));

      const response = await api.post("/ai/chat", { message: userMessage.text, history });
      const replyText = response.data.reply || "Je n'ai pas pu générer de réponse.";
      const showButton = hasMealProposal(replyText);
      const mealName = showButton ? extractMealFromText(replyText) : "";

      setMessages(prev => [...prev, { sender: "model", text: replyText, showButton, mealName }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "model", text: "❌ Erreur de connexion. Veuillez réessayer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="btn btn-circle btn-primary btn-lg shadow-xl animate-bounce">
            <MessageCircle size={32} />
          </button>
        )}

        {isOpen && (
          <div className="flex flex-col w-80 sm:w-96 h-[520px] bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-200">
            {/* Header */}
            <div className="bg-primary text-primary-content p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={22} />
                <div>
                  <h3 className="font-bold text-base leading-tight">Diététicien IA</h3>
                  <p className="text-xs opacity-75">Votre assistant nutrition</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-circle btn-sm">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto bg-base-200 space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sender === "user" ? "bg-primary" : "bg-white shadow"}`}>
                    {msg.sender === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-primary" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${msg.sender === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white text-base-content rounded-tl-none"}`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    {msg.showButton && (
                      <button
                        onClick={() => openModal(msg.mealName)}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all"
                      >
                        <CalendarPlus size={14} />
                        Ajouter au planning
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <span className="loading loading-dots loading-sm text-primary"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-base-100 border-t border-base-200">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Demandez un repas..."
                  className="input input-bordered input-sm flex-1 text-sm"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button type="submit" className="btn btn-primary btn-sm btn-square" disabled={!input.trim() || isLoading}>
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Add to Planning Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">📅 Ajouter au planning</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">"{modal.mealName}"</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nom du repas</label>
                <input
                  type="text"
                  value={modal.mealName}
                  onChange={e => setModal(m => ({ ...m, mealName: e.target.value }))}
                  className="input input-bordered input-sm w-full mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Jour</label>
                <select
                  value={modal.day}
                  onChange={e => setModal(m => ({ ...m, day: e.target.value }))}
                  className="select select-bordered select-sm w-full mt-1"
                >
                  {DAYS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Type de repas</label>
                <select
                  value={modal.mealType}
                  onChange={e => setModal(m => ({ ...m, mealType: e.target.value }))}
                  className="select select-bordered select-sm w-full mt-1"
                >
                  {MEALS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="btn btn-ghost btn-sm flex-1">
                Annuler
              </button>
              <button onClick={handleAddToPlanning} className="btn btn-primary btn-sm flex-1">
                ✅ Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
