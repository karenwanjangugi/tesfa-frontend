// "use client";
// import { useState, useEffect } from "react";
// import { useQueryLog } from "../../../hooks/useQueryLog";
// import { motion } from "framer-motion";
// import { Send, MessageCircle } from "lucide-react";

// let globalId = Date.now();
// function uniqueId() {
//   return ++globalId;
// }

// export default function ChatWidget() {
//   const { logs, submitQuery } = useQueryLog();

//   const [input, setInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [localMessages, setLocalMessages] = useState<{ id: number; text: string; sender: "user" | "bot" }[]>([]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = {
//       id: uniqueId(),
//       text: input,
//       sender: "user" as const,
//     };

//     setLocalMessages(prev => [...prev, userMessage]);

//     try {
//       await submitQuery(input);
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     } finally {
//       setInput("");
//     }
//   };

//   const logMessages = logs.map(log => ({
//     id: log.id,
//     text: log.response || log.query,
//     sender: log.response ? "bot" : "user",
//   }));

//   const allMessages = [
//     ...localMessages,
//     ...logMessages.filter(logMsg => 
//       !(logMsg.sender === "user" && 
//         localMessages.some(localMsg => localMsg.text === logMsg.text && localMsg.sender === "user"))
//     )
//   ].sort((a, b) => a.id - b.id);

//   return (
//     <div className="fixed right-3 top-6 z-[1150]">
//       {!open && (
//         <button
//           onClick={() => setOpen(true)}
//           className="w-14 h-14 rounded-full bg-cyan-900 flex items-center justify-center text-white shadow-lg"
//         >
//           <MessageCircle size={28} />
//         </button>
//       )}
//       {open && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="w-80 h-96 bg-cyan-900 shadow-lg rounded-2xl flex flex-col"
//         >
//           <div className="p-3 border-b flex justify-between items-center">
//             <span className="font-semibold">Chat</span>
//             <button onClick={() => setOpen(false)} className="text-white hover:text-gray-300">
//               ✕
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto p-3 space-y-2">
//             {allMessages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-3 py-1 rounded-xl max-w-xs ${
//                     msg.sender === "user"
//                       ? "bg-[#0391A6] text-black"
//                       : "bg-amber-700"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="p-2 border-t">
//             <div className="relative">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 className="w-full border rounded-full px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Type a message..."
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim()}
//                 className="absolute right-3 top-1/2 -translate-y-1/2  p-1.5 rounded-full text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
//                 aria-label="Send message"
//               >
//                 <Send size={20}  className="transform rotate-35" />
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useQueryLog } from "../../../hooks/useQueryLog";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";

let globalId = Date.now();
function uniqueId() {
  return ++globalId;
}

export default function ChatWidget() {
  const { logs, submitQuery } = useQueryLog();

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

 
  const pairedMessages = logs
    .sort((a, b) => a.id - b.id)
    .map(log => [
      { id: uniqueId(), text: log.query, sender: "user" },
      { id: uniqueId(), text: log.response, sender: "bot" },
    ])
    .flat();

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);

    try {
      await submitQuery(input);
      setInput(""); // clear input after sending
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed right-5 top-8 z-[1150]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-full bg-cyan-900 flex items-center justify-center text-white shadow-lg"
        >
          <MessageCircle size={32} />
        </button>
      )}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[420px] h-[540px] bg-cyan-900 shadow-lg rounded-2xl flex flex-col"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <span className="font-semibold text-lg">Chat</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-300">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-700">
            {pairedMessages.map((msg, idx) => (
              <div key={msg.id + idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-xl max-w-[75%] break-words whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-[#0391A6] text-black"
                      : "bg-amber-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full border rounded-full px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="Type a message..."
                disabled={sending}
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