import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import MembersHeader from "../components/members/MembersHeader";
import MembersTable from "../components/members/MembersTable";
import InviteMemberModal from "../components/members/InviteMemberModal";

import { useAuth } from "../context/AuthContext";
import {
  getWorkspaceMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
} from "../services/workspaceService";

export default function Members() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getWorkspaceMembers();
      setMembers(data);
    } catch (error) {
      // Non-admins get a 403 here since the list itself is admin-only —
      // treat that as "nothing to show" rather than an error toast.
      if (error.response?.status !== 403) {
        toast.error(error.response?.data?.message || "Could not load members.");
      }
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInvite = async (form) => {
    const data = await inviteMember(form);
    setMembers((prev) => [...prev, data.member]);
    toast.success("Member invited successfully.");
    return data;
  };

  const handleChangeRole = async (member, newRole) => {
    if (newRole === member.role) return;

    const previous = members;
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m)),
    );

    try {
      await updateMemberRole(member.id, newRole);
      toast.success(`${member.name}'s role updated to ${newRole}.`);
    } catch (error) {
      setMembers(previous); // revert optimistic update on failure
      toast.error(error.response?.data?.message || "Could not update role.");
    }
  };

  const handleRemove = async (member) => {
    const confirmed = window.confirm(
      `Remove ${member.name} (${member.email}) from this workspace? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await removeMember(member.id);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      toast.success("Member removed.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove member.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <div className="flex h-[60vh] items-center justify-center text-lg text-gray-400">
            Loading members...
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <MembersHeader
          onRefresh={loadMembers}
          onInvite={() => setShowInvite(true)}
          isAdmin={isAdmin}
        />

        {!isAdmin ? (
          <div className="rounded-2xl border border-[#173331] bg-[#111B1A] py-16 text-center text-gray-400">
            Only workspace admins can view and manage members.
          </div>
        ) : (
          <MembersTable
            members={members}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            onChangeRole={handleChangeRole}
            onRemove={handleRemove}
          />
        )}

        <InviteMemberModal
          open={showInvite}
          onClose={() => setShowInvite(false)}
          onInvite={handleInvite}
        />
      </PageContainer>
    </DashboardLayout>
  );
}