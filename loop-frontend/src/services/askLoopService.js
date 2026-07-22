import api from "./api";

// The backend enforces authentication and supplies the workspace ID itself.
export async function askLoop(question) {
  const { data } = await api.post("/insights/ask", { question });
  return data;
}

// Chat history remains a local UI convenience; the API intentionally has no
// chat-history endpoint because every Ask LOOP response is grounded per call.
export async function clearChatHistory() { return true; }
