import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, FileText } from "lucide-react";
import { insightsApi } from "../lib/api";

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

  async function ask(question) {
    if (!question.trim() || thinking) return;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setThinking(true);

    try {
      const res = await insightsApi.ask(question);
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.answer, citations: res.data.citations }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: err?.response?.data?.message || "Something went wrong answering that — try again." },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="chat-page">
      <header style={{ marginBottom: 16 }}>
        <h1 className="page-title">Ask LOOP</h1>
        <p className="page-subtitle">Grounded Q&amp;A — answers are cited to real feedback, never invented.</p>
      </header>

      <div className="panel chat-panel">
        <div className="chat-scroll">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <ChatBubble key={i} message={m} />
            ))}
            {thinking && (
              <div className="chat-thinking">
                <Sparkles size={15} />
                <span className="u-mono" style={{ fontSize: 12 }}>
                  Retrieving relevant feedback…
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {messages.length === 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => ask(s)} className="chip">
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
          className="chat-input-row"
        >
          <input
            className="input"
            placeholder="Ask a question about your customer feedback…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-icon" disabled={thinking || !input.trim()} aria-label="Send">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`chat-row ${isUser ? "chat-row-user" : "chat-row-assistant"}`}>
      <div className="chat-bubble-wrap">
        <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>{message.text}</div>
        {message.citations?.length > 0 && (
          <div className="chat-citations">
            {message.citations.map((c) => (
              <div key={c.id} className="chat-citation">
                <FileText size={13} className="chat-citation-icon" />
                <div>
                  <p className="chat-citation-text">{c.content}</p>
                  <p className="chat-citation-meta">
                    {c.channel} · {c.customerLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
