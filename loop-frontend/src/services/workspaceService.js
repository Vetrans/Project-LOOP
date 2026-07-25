import api from "./api";

export async function getWorkspaceMembers() {
  const { data } = await api.get("/workspace/members");
  return data;
}

export async function inviteMember(payload) {
  const { data } = await api.post("/workspace/members/invite", payload);
  return data; // { member, tempPassword }
}

export async function updateMemberRole(id, role) {
  const { data } = await api.patch(`/workspace/members/${id}`, { role });
  return data;
}

export async function removeMember(id) {
  const { data } = await api.delete(`/workspace/members/${id}`);
  return data;
}