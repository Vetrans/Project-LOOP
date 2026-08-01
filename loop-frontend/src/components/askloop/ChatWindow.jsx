import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Mic, Sparkles } from "lucide-react";

import ChatHeader from "./ChatHeader";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestedQuestions from "./SuggestedQuestions";

import askLoopPrompts from "../../data/askLoopPrompts";

export default function ChatWindow({
  title,
  messages,
  isLoading,
  onSend,
  onNewChat,
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  // Refocus the textarea whenever the active conversation changes (title
  // changes whenever the user switches chats via the sidebar).
  useEffect(() => {
    textareaRef.current?.focus();
  }, [title]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const submit = (question = input) => {
    if (!question.trim()) return;
    onSend(question);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "56px";
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0E1515] shadow-2xl">
      <ChatHeader title={title} onNewChat={onNewChat} />

      <div className="min-h-140 max-h-140 flex-1 overflow-y-auto bg-[#0B1212] px-8 py-8">
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center">
            {/* AI Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-emerald-500 shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-center text-4xl font-bold text-white">
              How can I help today?
            </h2>

            <p className="mt-4 max-w-3xl text-center text-lg leading-8 text-gray-400">
              Ask LOOP AI to analyze customer feedback, summarize reviews,
              detect sentiment, identify customer issues and generate
              business insights instantly.
            </p>

            <div className="mt-10 w-full max-w-5xl">
              <SuggestedQuestions prompts={askLoopPrompts} onSelect={submit} />
            </div>
          </div>
        ) : (
          <div className="flex min-h-full flex-col justify-end">
            <div className="space-y-8">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={chatEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-[#0E1515] p-6">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#131C1C] p-3">
          <button
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            placeholder="Ask LOOP AI anything..."
            className="max-h-40 min-h-14 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-3 text-white placeholder:text-gray-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />

          <button
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            title="Voice Input"
          >
            <Mic size={20} />
          </button>

          <button
            onClick={() => submit()}
            disabled={!input.trim() || isLoading}
            className="rounded-xl bg-cyan-500 p-3 text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            LOOP AI may occasionally make mistakes. Verify important information.
          </p>

          <span className="text-xs text-gray-600">
            Enter ↵ to send • Shift + Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}