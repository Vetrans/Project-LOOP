import api from "./api";

export async function getSettings() {
  const { data } = await api.get("/settings");
  return data;
}

export async function saveSettings(payload) {
  const { data } = await api.put("/settings", payload);
  return data;
}

export async function resetSettings() {
  const { data } = await api.post("/settings/reset");
  return data;
}

export async function changePassword(payload) {
  const { data } = await api.post("/settings/change-password", payload);
  return data;
}