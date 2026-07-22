import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ChatBubble({ message }) {
  const isUser = message.type === "user";
  const [copied, setCopied] = useState(false);

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