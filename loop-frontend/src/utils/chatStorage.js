const STORAGE_PREFIX = "loop_ask_conversations";

function storageKey(userId) {
  // Scoped per user so two different people logging into LOOP on the
  // same browser never see each other's Ask LOOP history.
  return `${STORAGE_PREFIX}:${userId || "anonymous"}`;
}

export function loadConversations(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(userId, conversations) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(conversations));
  } catch {
    // localStorage can fail (quota exceeded, private browsing) — chat
    // still works for the current session, it just won't persist.
  }
}

export function createConversation() {
  const now = Date.now();
  return {
    id: `chat_${now}_${Math.random().toString(36).slice(2, 8)}`,
    title: "New Chat",
    titleIsCustom: false,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

// Turns the first user question into a short default title (e.g. "What
// are users saying about onboarding?" stays short as-is; longer ones get
// truncated). Only used until the user renames it themselves.
export function deriveTitle(text) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= 42) return clean;
  return `${clean.slice(0, 42)}…`;
}