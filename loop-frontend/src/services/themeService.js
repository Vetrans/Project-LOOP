import api from "./api";

export async function getThemes() {
  const { data } = await api.get("/themes");
  return data; // [{ _id, name, color, count }, ...]
}