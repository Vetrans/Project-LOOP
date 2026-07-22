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

import {
  getSettings,
  saveSettings,
  resetSettings,
} from "../services/settingsService";

export default function Settings() {
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

  const loadSettings = async () => {
    setLoading(true);

    try {
      const data = await getSettings();

      setProfile(data.profile);
      setSecurity(data.security);
      setNotifications(data.notifications);
      setAI(data.ai);
      setAppearance(data.appearance);
      setOrganization(data.organization);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.success("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      await saveSettings({
        profile,
        security,
        notifications,
        ai,
        appearance,
        organization,
      });

      setLastSaved(new Date().toLocaleString());

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      toast.success("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    loadSettings();
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

      setProfile(data.profile);
      setSecurity(data.security);
      setNotifications(data.notifications);
      setAI(data.ai);
      setAppearance(data.appearance);
      setOrganization(data.organization);

      setLastSaved("Never");

      toast.success("Settings reset successfully.");
    } catch (error) {
      console.error("Reset Error:", error);
      toast.success("Failed to reset settings.");
    } finally {
      setLoading(false);
    }
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