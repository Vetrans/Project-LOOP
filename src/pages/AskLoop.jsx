import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, FileText } from "lucide-react";
import { mockFeedback } from "../lib/mockData";

const SUGGESTIONS = [
  "What are users saying about onboarding?",
  "Is anyone asking for SSO?",
  "What's driving negative billing feedback?",
];

export default function AskLoop() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me anything about your feedback — I'll only answer from what's actually in your workspace, and I'll show you the items I used.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function ask(question) {
    if (!question.trim() || thinking) return;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setThinking(true);

    // Wire this to insightsApi.ask(question) once the backend + retrieval
    // pipeline exist. This mock simulates retrieve-then-answer with a
    // relevant slice of the seeded feedback so the grounding UI is real.
    setTimeout(() => {
      const matches = mockFeedback.filter((f) =>
        question.toLowerCase().includes("onboard")
          ? f.themes.includes("Onboarding friction")
          : question.toLowerCase().includes("sso") || question.toLowerCase().includes("security")
          ? f.themes.includes("SSO / security")
          : question.toLowerCase().includes("bill")
          ? f.themes.includes("Billing & invoices")
          : f.sentiment === "NEG"
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: buildAnswer(question, matches),
          citations: matches.slice(0, 3),
        },
      ]);
      setThinking(false);
    }, 900);
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold text-mist-100">Ask LOOP</h1>
        <p className="mt-1 text-sm text-mist-400">Grounded Q&A — answers are cited to real feedback, never invented.</p>
      </header>

      <div className="panel flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-5">
            {messages.map((m, i) => (
              <ChatBubble key={i} message={m} />
            ))}
            {thinking && (
              <div className="flex items-center gap-2 text-mist-400">
                <Sparkles size={15} className="animate-pulse text-loop-violet" />
                <span className="font-mono text-xs">Retrieving relevant feedback…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 border-t border-ink-700 px-6 py-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-ink-600 px-3 py-1.5 text-xs text-mist-300 hover:border-loop-violet/60 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-ink-700 px-4 py-3"
        >
          <input
            className="input flex-1"
            placeholder="Ask a question about your customer feedback…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-primary !px-3" disabled={thinking || !input.trim()} aria-label="Send">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function buildAnswer(question, matches) {
  if (matches.length === 0) {
    return "I couldn't find feedback in this workspace that answers that — try rephrasing, or check back once more feedback has been ingested.";
  }
  const themeNames = [...new Set(matches.flatMap((m) => m.themes))];
  return `Based on ${matches.length} matching feedback item${matches.length === 1 ? "" : "s"}, the main pattern relates to ${themeNames.join(
    ", "
  )}. Customers describe this consistently across channels — see the cited items below for exact wording.`;
}

function ChatBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${isUser ? "order-2" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            isUser ? "bg-loop-violet text-white" : "bg-ink-800 text-mist-100"
          }`}
        >
          {message.text}
        </div>
        {message.citations?.length > 0 && (
          <div className="mt-2 flex flex-col gap-1.5">
            {message.citations.map((c) => (
              <div key={c.id} className="flex items-start gap-2 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2">
                <FileText size={13} className="mt-0.5 shrink-0 text-loop-violet" />
                <div>
                  <p className="text-xs text-mist-200">{c.content}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-mist-400">{c.channel} · {c.customerLabel}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
