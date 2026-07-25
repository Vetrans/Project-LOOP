import api from "./api";

export async function getFeedback(params = {}) {
  const { data } = await api.get("/feedback", { params });
  return data;
}

export async function addFeedback({ customer, feedback, channel }) {
  const { data } = await api.post("/feedback", {
    customerLabel: customer,
    content: feedback,
    channel,
  });
  return data;
}

export async function updateFeedbackStatus(id, status) {
  const { data } = await api.patch(`/feedback/${id}/status`, { status });
  return data;
}

export async function uploadFeedbackCSV(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/feedback/import", formData);
  return data;
}

// Seeds realistic feedback for a given channel to simulate a live
// integration (brief C3) — see backend/src/utils/simulatedChannels.js.
export async function simulateChannel(channel, count = 5) {
  const { data } = await api.post("/feedback/simulate", { channel, count });
  return data;
}