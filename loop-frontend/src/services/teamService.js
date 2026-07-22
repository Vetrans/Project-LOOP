import {
  teamMembers,
  teamSummary,
} from "../data/teamData";

export async function getTeamSummary() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(teamSummary);
    }, 500);
  });
}

export async function getTeamMembers() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(teamMembers);
    }, 500);
  });
}

export async function createMember(member) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        member,
      });
    }, 500);
  });
}

export async function updateMember(member) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        member,
      });
    }, 500);
  });
}

export async function deleteMember(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id,
      });
    }, 500);
  });
}