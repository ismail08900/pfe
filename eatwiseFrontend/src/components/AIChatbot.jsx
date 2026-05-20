import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import api from "../api";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "model", text: "Bonjour ! Je suis votre diététicien IA. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // On envoie l'historique récent (sans le tout premier message de bienvenue)
      const history = messages.slice(1).map(m => ({ sender: m.sender, text: m.text }));
      
      const response = await api.post("/ai/chat", {
        message: userMessage.text,
        history: history
      });

      setMessages((prev) => [
        ...prev,
        { sender: "model", text: response.data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "model", text: "Désolé, je rencontre une erreur de connexion." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton pour ouvrir le chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-circle btn-primary btn-lg shadow-xl animate-bounce"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="flex flex-col w-80 sm:w-96 h-[500px] bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-200 transition-all duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-content p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <h3 className="font-bold text-lg">Diététicien IA</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-circle btn-sm"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-base-200">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"} mb-2`}
              >
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full bg-base-300 flex items-center justify-center">
                    {msg.sender === "user" ? <User size={16} /> : <Bot size={16} className="text-primary" />}
                  </div>
                </div>
                <div
                  className={`chat-bubble text-sm ${
                    msg.sender === "user" ? "chat-bubble-primary text-white" : "chat-bubble-base-100 shadow-sm text-base-content"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat chat-start mb-2">
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full bg-base-300 flex items-center justify-center">
                    <Bot size={16} className="text-primary" />
                  </div>
                </div>
                <div className="chat-bubble chat-bubble-base-100 shadow-sm flex items-center gap-2">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <div className="p-3 bg-base-100 border-t border-base-200">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Posez votre question..."
                className="input input-bordered input-sm flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm btn-square"
                disabled={!input.trim() || isLoading}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
