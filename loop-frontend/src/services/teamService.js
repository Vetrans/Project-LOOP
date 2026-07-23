import api from "./api";

export async function getTeamSummary() {
  const { data } = await api.get("/team/summary");
  return data;
}

export async function getTeamMembers() {
  const { data } = await api.get("/team");
  return data;
}

export async function createMember(member) {
  const { data } = await api.post("/team", member);
  return data;
}

export async function updateMember(id, member) {
  const { data } = await api.patch(`/team/${id}`, member);
  return data;
}

export async function deleteMember(id) {
  const { data } = await api.delete(`/team/${id}`);
  return data;
}