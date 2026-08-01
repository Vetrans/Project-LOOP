import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, MessageSquare } from "lucide-react";

function timeAgo(timestamp) {
  const diffMs = Date.now() - timestamp;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ChatHistorySidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");

  const startEditing = (conversation) => {
    setEditingId(conversation.id);
    setDraftTitle(conversation.title);
  };

  const confirmEditing = () => {
    if (editingId) onRename(editingId, draftTitle);
    setEditingId(null);
    setDraftTitle("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftTitle("");
  };

  const handleDelete = (e, conversation) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete "${conversation.title}"? This can't be undone.`,
    );
    if (confirmed) onDelete(conversation.id);
  };

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-3xl border border-white/10 bg-[#0E1515] p-4 shadow-2xl">
      <button
        onClick={onNewChat}
        className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-medium text-black transition hover:bg-cyan-400"
      >
        <Plus size={18} />
        New Chat
      </button>

      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {sorted.map((conversation) => {
          const isActive = conversation.id === activeId;
          const isEditing = editingId === conversation.id;

          return (
            <div
              key={conversation.id}
              onClick={() => !isEditing && onSelect(conversation.id)}
              className={`group flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 transition ${
                isActive
                  ? "border-cyan-500/30 bg-cyan-500/15"
                  : "border-transparent hover:bg-white/5"
              }`}
            >
              <MessageSquare
                size={16}
                className={`shrink-0 ${isActive ? "text-cyan-400" : "text-gray-500"}`}
              />

              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <input
                    autoFocus
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmEditing();
                      if (e.key === "Escape") cancelEditing();
                    }}
                    className="w-full rounded-lg border border-cyan-500/40 bg-[#141C1C] px-2 py-1 text-sm text-white outline-none"
                  />
                ) : (
                  <>
                    <p
                      className={`truncate text-sm font-medium ${
                        isActive ? "text-white" : "text-gray-300"
                      }`}
                      title={conversation.title}
                    >
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {timeAgo(conversation.updatedAt)}
                    </p>
                  </>
                )}
              </div>

              {isEditing ? (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmEditing();
                    }}
                    className="rounded-lg p-1.5 text-emerald-400 hover:bg-white/10"
                    title="Save name"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelEditing();
                    }}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10"
                    title="Cancel"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(conversation);
                    }}
                    title="Rename this chat"
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, conversation)}
                    title="Delete this chat"
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}