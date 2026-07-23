import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import TeamHeader from "../components/team/TeamHeader";
import TeamSummaryCards from "../components/team/TeamSummaryCards";
import TeamFilters from "../components/team/TeamFilters";
import TeamTable from "../components/team/TeamTable";
import TeamProfileDrawer from "../components/team/TeamProfileDrawer";
import MemberModal from "../components/team/MemberModal";
import DeleteConfirmModal from "../components/team/DeleteConfirmModal";

import {
  getTeamSummary,
  getTeamMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../services/teamService";

import {
  roles,
  departments,
  statusList,
} from "../data/teamData";

export default function Team() {
  const [summary, setSummary] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  const [selectedMember, setSelectedMember] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [summaryData, membersData] = await Promise.all([
        getTeamSummary(),
        getTeamMembers(),
      ]);

      setSummary(summaryData);
      setMembers(membersData);
    } catch (error) {
      console.error(error);
      toast.error("Could not load team data.");
    } finally {
      setLoading(false);
    }
  };

  const refreshSummary = async () => {
    try {
      setSummary(await getTeamSummary());
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role === "All" || member.role === role;
      const matchesDepartment =
        department === "All" || member.department === department;
      const matchesStatus = status === "All" || member.status === status;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [members, search, role, department, status]);

  const clearFilters = () => {
    setSearch("");
    setRole("All");
    setDepartment("All");
    setStatus("All");
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setDrawerOpen(true);
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setShowModal(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleSaveMember = async (formData) => {
    setSaving(true);

    try {
      if (editingMember) {
        const updated = await updateMember(editingMember.id, formData);
        setMembers((prev) =>
          prev.map((member) =>
            member.id === editingMember.id ? updated : member,
          ),
        );
        toast.success("Team member updated.");
      } else {
        const created = await createMember(formData);
        setMembers((prev) => [created, ...prev]);
        toast.success("Team member added.");
      }

      setShowModal(false);
      setEditingMember(null);
      await refreshSummary();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not save team member.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(deleteTarget.id);

      setMembers((prev) =>
        prev.filter((member) => member.id !== deleteTarget.id),
      );

      if (selectedMember && selectedMember.id === deleteTarget.id) {
        setSelectedMember(null);
        setDrawerOpen(false);
      }

      toast.success("Team member removed.");
      await refreshSummary();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not delete team member.",
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <div className="flex h-[70vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#173331] border-t-[#32E6A4]" />
              <h2 className="mt-6 text-2xl font-semibold text-white">
                Loading Team...
              </h2>
              <p className="mt-2 text-gray-400">
                Please wait while we load your members.
              </p>
            </div>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <TeamHeader
          onRefresh={handleRefresh}
          onAddMember={handleAddMember}
        />

        <TeamSummaryCards summary={summary} />

        <TeamFilters
          search={search}
          setSearch={setSearch}
          role={role}
          setRole={setRole}
          department={department}
          setDepartment={setDepartment}
          status={status}
          setStatus={setStatus}
          roles={roles}
          departments={departments}
          statusList={statusList}
          onClear={clearFilters}
        />

        {filteredMembers.length === 0 ? (
          <div className="rounded-2xl border border-[#173331] bg-[#111B1A] py-20 text-center">
            <h2 className="text-2xl font-semibold text-white">
              No Team Members Found
            </h2>

            <p className="mt-3 text-gray-400">
              Try changing the filters or add a new team member.
            </p>

            <button
              onClick={handleAddMember}
              className="mt-8 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              Add Member
            </button>
          </div>
        ) : (
          <TeamTable
            members={filteredMembers}
            onView={handleView}
            onEdit={handleEditMember}
            onDelete={setDeleteTarget}
          />
        )}

        <TeamProfileDrawer
          open={drawerOpen}
          member={selectedMember}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedMember(null);
          }}
        />

        <MemberModal
          open={showModal}
          member={editingMember}
          onClose={() => {
            setShowModal(false);
            setEditingMember(null);
          }}
          onSave={handleSaveMember}
        />

        <DeleteConfirmModal
          open={!!deleteTarget}
          member={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDelete={handleDelete}
        />
      </PageContainer>
    </DashboardLayout>
  );
}