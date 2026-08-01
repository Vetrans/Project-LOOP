import api from "./api";

// The backend enforces authentication and supplies the workspace ID itself.
export async function askLoop(question) {
  const { data } = await api.post("/insights/ask", { question });
  return data;
}