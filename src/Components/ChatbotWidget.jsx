// ChatbotWidget.jsx
import { useState, useRef, useEffect } from "react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m TalentLink’s Customer Service Bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "How do I create an account?",
    "Tell me about job applications",
    "Who are you?",
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatText = (text) => {
    const formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return { __html: formatted };
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSuggestions([]);
    setLoading(true);

    try {
      const res = await puter.ai.chat(
        [
          {
            role: "system",
            content: `You are TalentLink’s official customer service bot. 
- Always introduce yourself as "TalentLink Customer Support Bot".
- Answer only questions related to TalentLink’s platform (accounts, jobs, applications, profile, etc.).
- If asked "who are you", reply: "I am TalentLink Customer Service Bot, here to help you with the platform."
- If the user asks something unrelated, politely redirect them back to TalentLink services.`,
          },
          { role: "user", content: userMsg.text },
        ],
        { model: "gpt-4o-mini" }
      );

      const reply = res.message?.content || "⚠️ No reply";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="">
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 z-1 right-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-300"
      >
        💬
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-[28rem] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden transform animate-[slideUp_0.3s_ease-out]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">TalentLink Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 px-2 py-1 rounded-lg transition"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-2xl max-w-[75%] shadow-sm transition-all ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white ml-auto animate-[fadeInRight_0.3s_ease-out]"
                    : "bg-gray-200 text-gray-800 mr-auto animate-[fadeInLeft_0.3s_ease-out]"
                }`}
                dangerouslySetInnerHTML={formatText(msg.text)}
              />
            ))}
            {loading && (
              <div className="flex items-center gap-1 text-gray-500 ml-1 animate-pulse">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2 flex flex-wrap gap-2 border-t bg-white">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-full transition shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-2 border-t flex bg-white">
            <input
              type="text"
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me about TalentLink..."
            />
            <button
              onClick={() => sendMessage()}
              className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-md"
              disabled={loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
