import {
  profileData,
  securityData,
  notificationData,
  aiPreferenceData,
  appearanceData,
  organizationData,
} from "../data/settingsData";

const STORAGE_KEY = "loop-ai-settings";

const defaultSettings = {
  profile: profileData,
  security: securityData,
  notifications: notificationData,
  ai: aiPreferenceData,
  appearance: appearanceData,
  organization: organizationData,
};

export const getSettings = async () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(defaultSettings)
  );

  return defaultSettings;
};

export const saveSettings = async (settings) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );

  return {
    success: true,
  };
};

export const resetSettings = async () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(defaultSettings)
  );

  return defaultSettings;
};