import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";

import SettingsHeader from "../components/settings/SettingsHeader";
import ProfileSettings from "../components/settings/ProfileSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AIPreferences from "../components/settings/AIPreferences";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import OrganizationSettings from "../components/settings/OrganizationSettings";
import SaveSettings from "../components/settings/SaveSettings";

import { useAuth } from "../context/AuthContext";

import {
  getSettings,
  saveSettings,
  resetSettings,
  changePassword,
} from "../services/settingsService";

export default function Settings() {
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({});
  const [security, setSecurity] = useState({});
  const [notifications, setNotifications] = useState({});
  const [ai, setAI] = useState({});
  const [appearance, setAppearance] = useState({});
  const [organization, setOrganization] = useState({});

  const [lastSaved, setLastSaved] = useState("Never");

  useEffect(() => {
    loadSettings();
  }, []);

  const applySettings = (data) => {
    setProfile(data.profile);
    setSecurity(data.security);
    setNotifications(data.notifications);
    setAI(data.ai);
    setAppearance(data.appearance);
    setOrganization(data.organization);
  };

  const loadSettings = async () => {
    setLoading(true);

    try {
      const data = await getSettings();
      applySettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const data = await saveSettings({
        profile,
        security,
        notifications,
        ai,
        appearance,
        organization,
      });

      applySettings(data);

      // Keep Topbar/Sidebar in sync with whatever just got saved,
      // without a full page reload.
      updateUser({
        name: data.profile.name,
        phone: data.profile.phone,
        designation: data.profile.designation,
        department: data.profile.department,
        avatarUrl: data.profile.avatarUrl,
        workspace: { name: data.organization.company },
      });

      setLastSaved(new Date().toLocaleString());

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to save settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadSettings();
    toast.success("Settings refreshed.");
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm(
      "Discard all unsaved changes?"
    );

    if (!confirmCancel) return;

    await loadSettings();

    toast.success("Changes discarded.");
  };

  const handleReset = async () => {
    const confirmReset = window.confirm(
      "Reset all settings to default values?"
    );

    if (!confirmReset) return;

    setLoading(true);

    try {
      const data = await resetSettings();
      applySettings(data);

      setLastSaved("Never");

      toast.success("Settings reset successfully.");
    } catch (error) {
      console.error("Reset Error:", error);
      toast.error("Failed to reset settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (payload) => {
    await changePassword(payload);
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <SettingsHeader
          onRefresh={handleRefresh}
          onSave={handleSave}
          loading={loading}
        />

        <div className="space-y-8">
          <ProfileSettings
            profile={profile}
            setProfile={setProfile}
          />

          <SecuritySettings
            security={security}
            setSecurity={setSecurity}
            onChangePassword={handleChangePassword}
          />

          <NotificationSettings
            notifications={notifications}
            setNotifications={setNotifications}
          />

          <AIPreferences
            ai={ai}
            setAI={setAI}
          />

          <AppearanceSettings
            appearance={appearance}
            setAppearance={setAppearance}
          />

          <OrganizationSettings
            organization={organization}
            setOrganization={setOrganization}
          />

          <SaveSettings
            loading={loading}
            lastSaved={lastSaved}
            onSave={handleSave}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}