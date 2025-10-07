"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, RotateCcw, Download } from "lucide-react";
import { useQueryLog } from "../../../hooks/useQueryLog";
interface Message {
  id: number;
  text: string | undefined;
  sender: "user" | "bot";
  loading?: boolean;
}
let globalId = Date.now();
function uniqueId() {
  return ++globalId;
}
function BouncingDots() {
  return (
    <div className="bouncing-loader flex justify-center space-x-1">
      <span className="dot animate-bounce delay-150">.</span>
      <span className="dot animate-bounce delay-300">.</span>
      <span className="dot animate-bounce delay-450">.</span>
      <style>{`
        .dot {
          font-size: 20px;
          color: white;
          animation-duration: 0.6s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          display: inline-block;
        }
        .animate-bounce {
          animation-name: bounce;
        }
        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-450 { animation-delay: 450ms; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
export default function ChatWidget() {
  const { submitQuery } = useQueryLog();
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [localLogs, setLocalLogs] = useState<Message[]>([]);
  const [greeted, setGreeted] = useState<boolean>(false);
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setLocalLogs(JSON.parse(saved));
      setGreeted(true);
    }
  }, []);
  useEffect(() => {
    if (localLogs.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(localLogs));
    }
  }, [localLogs]);
  useEffect(() => {
    if (open && !greeted && localLogs.length === 0) {
      const greetingMessage: Message = {
        id: uniqueId(),
        text: "Hi, I’m Tesfa — your AI assistant. How can I help you today?",
        sender: "bot",
      };
      setLocalLogs([greetingMessage]);
      setGreeted(true);
    }
  }, [open, greeted, localLogs.length]);
  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const queryText = input;
    setInput("");
    setSending(true);
    setLocalLogs((prev) =>
      prev.filter((msg) => !msg.text?.includes("Hi, I’m Tesfa"))
    );
    const userMessage: Message = {
      id: uniqueId(),
      text: queryText,
      sender: "user",
    };
    const botLoadingMessage: Message = {
      id: uniqueId(),
      text: undefined,
      sender: "bot",
      loading: true,
    };
    setLocalLogs((prev) => [...prev, userMessage, botLoadingMessage]);
    try {
      const result = await submitQuery(queryText);
      const responseText = result?.response ?? "No response received";
      setLocalLogs((prev) =>
        prev.map((msg) =>
          msg.id === botLoadingMessage.id
            ? { ...msg, text: responseText, loading: false }
            : msg
        )
      );
    } catch {
      setLocalLogs((prev) =>
        prev.map((msg) =>
          msg.id === botLoadingMessage.id
            ? { ...msg, text: "Failed to load response", loading: false }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };
  const handleDownloadChat = () => {
    const chatText = localLogs
      .map((msg) => `${msg.sender === "user" ? "You" : "Bot"}: ${msg.text}`)
      .join("\n\n");
    const blob = new Blob([chatText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleReloadChat = () => {
    const greetingMessage: Message = {
      id: uniqueId(),
      text: "Hi, I’m Tesfa — your AI assistant. How can I help you today?",
      sender: "bot",
    };
    setLocalLogs([greetingMessage]);
    localStorage.setItem("chatHistory", JSON.stringify([greetingMessage]));
    setGreeted(true);
  };
  return (
    <div className="fixed right-5 top-8 z-[1150] flex flex-col items-end space-y-2">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-full bg-cyan-900 flex items-center justify-center text-white shadow-lg"
          aria-label="Open chat"
        >
          <MessageCircle size={32} />
        </button>
      )}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[420px] h-[540px] bg-cyan-900 shadow-lg rounded-2xl flex flex-col relative"
        >
          <div className="p-4 border-b border-white flex justify-between items-center">
            <span className="font-semibold text-lg text-white">Chat</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-300"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-700">
            {localLogs.map((msg, index) => (
              <div key={msg.id}>
                <div
                  className={`flex ${
                    msg.text?.includes("Hi, I’m Tesfa")
                      ? "justify-center"
                      : msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[75%] break-words whitespace-pre-line text-white
                      ${
                        msg.text?.includes("Hi, I’m Tesfa")
                          ? "bg-transparent text-lg font-semibold flex flex-col items-center text-center"
                          : msg.sender === "user"
                          ? "bg-[#0391A6]"
                          : "bg-[#0B3E46]"
                      }`}
                  >
                    {msg.loading ? (
                      <BouncingDots />
                    ) : msg.text?.includes("Hi, I’m Tesfa") ? (
                      <>
                        <span>Hi, I’m Tesfa</span>
                        <span className="text-sm font-normal text-gray-200 mt-1">
                          How can I help you today?
                        </span>
                      </>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
                {msg.sender === "bot" &&
                  !msg.loading &&
                  !msg.text?.includes("Hi, I’m Tesfa") &&
                  index === localLogs.length - 1 && (
                    <div className="flex justify-center mt-2 space-x-3">
                      <button
                        onClick={handleReloadChat}
                        className="flex items-center space-x-1 text-sm text-white/80 hover:text-white transition-colors"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={handleDownloadChat}
                        className="flex items-center space-x-1 text-sm text-white/80 hover:text-white transition-colors"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full border rounded-full px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500 text-white text-base bg-transparent"
                placeholder="Type a message..."
                disabled={sending}
                aria-label="Chat input"
                autoComplete="off"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={22} className="transform rotate-35" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}