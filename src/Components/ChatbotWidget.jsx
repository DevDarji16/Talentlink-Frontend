import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotWidget({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I'm TalentLink's Customer Service Bot. How can I help you today?" },
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
            content: `You are TalentLink's official customer service bot. 
- Always introduce yourself as "TalentLink Customer Support Bot".
- Answer only questions related to TalentLink's platform (accounts, jobs, applications, profile, etc.).
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
    <div onClick={e => e.stopPropagation()}>
      {/* Floating Button */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-2 right-3 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          rotate: isOpen ? 180 : 0,
          backgroundColor: isOpen ? "#4f46e5" : "#2563eb"
        }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? "✖" : "💬"}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-20 right-5 w-80 h-[28rem] bg-gray-900 border border-gray-700 shadow-xl rounded-lg flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gray-800 text-white p-3 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="font-semibold">TalentLink Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm bg-gray-900">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-lg max-w-[80%] ${msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto rounded-br-none"
                    : "bg-gray-800 text-gray-200 mr-auto rounded-bl-none"
                    }`}
                  dangerouslySetInnerHTML={formatText(msg.text)}
                />
              ))}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 text-gray-500 ml-1"
                >
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-2 bg-gray-500 rounded-full"
                  ></motion.span>
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-500 rounded-full"
                  ></motion.span>
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-500 rounded-full"
                  ></motion.span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 flex flex-wrap gap-2 border-t border-gray-700 bg-gray-800"
              >
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full transition-all"
                  >
                    {s}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-700 flex bg-gray-800">
              <input
                type="text"
                className="flex-1 border border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-700 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me about TalentLink..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()}
                className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                disabled={loading || !input.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}