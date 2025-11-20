"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, RotateCcw, Download } from "lucide-react";
import { useQueryLog } from "../../../hooks/useQueryLog";
import jsPDF from "jspdf";
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

function standardizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/[?.,!]/g, '');
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
  const [open, setOpen] = useState<boolean>(true);
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
  const predefinedMessages: { [key: string]: string } = {
    "Why is cholera high in Tigray":
    `Cholera is often high in regions like Tigray due to the strong links between armed conflicts and humanitarian emergencies. 
    These situations commonly lead to limited access to safe water supplies and poor sanitation infrastructure, creating ideal 
    conditions for cholera outbreaks. Water supplies have been affected by several factors. While conservation and rehabilitation
    efforts have reportedly contributed to increasing groundwater recharge and water levels in some areas, there's a significant
    concern regarding water pollution. The use of weaponry and leaks of toxic substances from industrial and other facilities 
    are major contributors to water contamination, which severely impacts the safety and availability of clean water for communities.`,
"Why is the risk of cleft lip and palate high in Ethiopia?": `The elevated risk of cleft lip and palate in Ethiopia stems from a combination of 
genetic, environmental, nutritional, and socioeconomic factors, with conflict 
exacerbating many of these issues in affected regions.

Genetic and Consanguinity Factors:
- **Higher Prevalence of Risk Alleles**: Certain populations in Ethiopia may carry 
  genetic variants associated with increased susceptibility to oral clefts, 
  influenced by the country's diverse ethnic groups.
- **Consanguineous Marriages**: In some Ethiopian communities, cultural practices of 
  marriage between close relatives increase the likelihood of recessive genetic 
  disorders manifesting, including those linked to cleft lip and palate.

Environmental and Conflict-Related Exposures:
- **Toxin Exposure in Conflict Zones**: In regions like Tigray, Amhara, and Oromia 
  affected by recent conflicts, environmental contamination from unexploded 
  ordnance, damaged infrastructure, and improper waste disposal can expose 
  pregnant women to teratogenic chemicals (e.g., heavy metals, dioxins) that 
  disrupt embryonic craniofacial development.
- **Air and Soil Pollution**: Widespread use of biomass fuels for cooking, 
  agricultural pesticides, and industrial pollutants in urban areas contribute 
  to chronic exposure to harmful substances.

Nutritional Deficiencies:
- **Folic Acid and Micronutrient Shortages**: Ethiopia faces high rates of maternal 
  malnutrition due to food insecurity, drought, and poverty. Low intake of folic 
  acid, zinc, and other essential nutrients during the periconceptional period is 
  a well-established risk factor for cleft lip and palate, as these support neural 
  crest cell migration critical for facial formation.
- **Limited Access to Fortified Foods**: Unlike in many countries, folate-fortified 
  staples are not widely available, leaving vulnerable populations without this 
  preventive measure.

Socioeconomic and Healthcare Barriers:
- **Inadequate Prenatal Care**: Only about 43% of pregnant women in Ethiopia receive 
  at least four antenatal care visits (per DHS data), limiting opportunities for 
  nutritional supplementation, risk screening, and education on avoiding teratogens.
- **Maternal Age and Parity**: High fertility rates and pregnancies at advanced 
  maternal age (>35) or in grand multiparity increase cleft risks.
- **Conflict-Induced Displacement**: Over 3 million internally displaced persons face 
  heightened malnutrition, stress, and exposure risks, amplifying cleft incidence 
  in these subgroups.
- **Infectious Diseases and Maternal Health**: Endemic infections like malaria, HIV, 
  and rubella—compounded by low vaccination coverage—can cause febrile illnesses 
  during critical gestational windows, indirectly raising cleft risks.

In Summary:
While Ethiopia's national cleft prevalence (around 1.5–2 per 1,000 live births, 
higher than the global average of ~1 in 700) reflects baseline genetic and 
nutritional vulnerabilities, ongoing conflicts and systemic healthcare gaps create 
hotspots of elevated risk through compounded environmental, nutritional, and 
access-related stressors.
`,
  };
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
      const standardizedInput = standardizeQuery(queryText);
      let predefinedResponse: string | undefined;

      for (const key in predefinedMessages) {
        if (standardizeQuery(key) === standardizedInput) {
          predefinedResponse = predefinedMessages[key];
          break;
        }
      }

      if (predefinedResponse) {
        setTimeout(() => {
          setLocalLogs((prev) =>
            prev.map((msg) =>
              msg.id === botLoadingMessage.id
                ? { ...msg, text: predefinedResponse, loading: false }
                : msg
            )
          );
          setSending(false);
        }, 3000);
      } else {
        const result = await submitQuery(queryText);
        const responseText = result?.response ?? "No response received";
        setLocalLogs((prev) =>
          prev.map((msg) =>
            msg.id === botLoadingMessage.id
              ? { ...msg, text: responseText, loading: false }
              : msg
          )
        );
        setSending(false);
      }
    } catch {
      setLocalLogs((prev) =>
        prev.map((msg) =>
          msg.id === botLoadingMessage.id
            ? { ...msg, text: "Failed to load response", loading: false }
            : msg
        )
      );
      setSending(false);
    }
  };
  const handleDownloadChat = () => {
    const doc = new jsPDF();

    doc.setProperties({
      title: "Health Report",
    });

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Health Report", 105, 20, { align: "center" });


    const chatText = localLogs
      .map((msg) => {
        const sender = msg.sender === "user" ? "You" : "Bot";
        const text =
          msg.text || (msg.loading ? "[Thinking...]" : "[Empty Message]");
        return `${sender}: ${text}`;
      })
      .join("\n\n");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(chatText, 175); 
    doc.text(splitText, 15, 35); 
    doc.save("health-report.pdf");
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
          className="w-16 cursor-pointer h-16 rounded-full bg-cyan-900 flex items-center justify-center text-white shadow-lg"
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
          <div className="p-4 border-b  border-white flex justify-between items-center">
            <span className="font-semibold text-lg text-white">Chat</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white cursor-pointer hover:text-gray-300"
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
                        className="flex cursor-pointer items-center space-x-1 text-sm text-white/80 hover:text-white transition-colors"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={handleDownloadChat}
                        className="flex cursor-pointer items-center space-x-1 text-sm text-white/80 hover:text-white transition-colors"
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
                <Send size={22} className="transform cursor-pointer rotate-35" />
              </button>
            </div>
            <p className="text-white text-[0.7em] mt-3 font-thin text-center">Tesfa aids decisions; experts should verify critical actions.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
