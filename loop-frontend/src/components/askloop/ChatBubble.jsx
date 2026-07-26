import { motion } from "framer-motion";
import { Bot, User, Copy, Check, Quote, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ChatBubble({ message }) {
  const isUser = message.type === "user";
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const citations = message.citations || [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const formatText = (text) => {
    return text.split("\n").map((line, index) => (
      <p
        key={index}
        className="mb-2 whitespace-pre-wrap leading-7"
      >
        {line}
      </p>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[75%] gap-3 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-cyan-500"
              : "bg-gradient-to-br from-emerald-500 to-cyan-500"
          }`}
        >
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-white" />
          )}
        </div>

        {/* Bubble */}

        <div
          className={`rounded-3xl px-5 py-4 shadow-lg ${
            isUser
              ? "bg-cyan-500 text-white"
              : "border border-white/10 bg-[#131C1C] text-gray-200"
          }`}
        >
          {formatText(message.text)}

          {/* Grounding citations — AI3 requires answers to cite the
              specific feedback items they're based on. Collapsed by
              default to keep the chat readable; expand to verify. */}
          {!isUser && citations.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                onClick={() => setShowSources((s) => !s)}
                className="flex items-center gap-2 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                <Quote size={14} />
                {showSources ? "Hide" : "Show"} {citations.length} source
                {citations.length === 1 ? "" : "s"}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showSources ? "rotate-180" : ""}`}
                />
              </button>

              {showSources && (
                <div className="mt-3 space-y-2">
                  {citations.map((citation, index) => (
                    <div
                      key={citation.id || index}
                      className="rounded-xl border border-white/10 bg-black/25 p-3"
                    >
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                        <span>
                          {citation.channel}
                          {citation.customerLabel ? ` • ${citation.customerLabel}` : ""}
                        </span>

                        {citation.themes?.length > 0 && (
                          <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-cyan-400">
                            {citation.themes[0]}
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-6 text-gray-300">
                        &ldquo;{citation.content}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs opacity-60">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {!isUser && (
              <button
                onClick={handleCopy}
                className="rounded-lg p-2 transition hover:bg-white/10"
              >
                {copied ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}