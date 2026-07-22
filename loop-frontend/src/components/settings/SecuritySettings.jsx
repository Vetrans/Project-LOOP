import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Smartphone,
  LogOut,
} from "lucide-react";

// Toggles (twoFactor, loginAlerts) are controlled by props like the
// rest of Settings. Password change is a real backend call now via
// onChangePassword, not localStorage.
export default function SecuritySettings({
  security,
  setSecurity,
  onChangePassword,
}) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [strength, setStrength] = useState("");
  const [changing, setChanging] = useState(false);

  const handleToggle = (field) => {
    setSecurity({
      ...security,
      [field]: !security[field],
    });
  };

  const calculateStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";

    return "Strong";
  };

  const handleNewPassword = (e) => {
    const value = e.target.value;

    setNewPassword(value);
    setStrength(calculateStrength(value));
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      toast.error("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setChanging(true);

    try {
      await onChangePassword({ currentPassword, newPassword });

      toast.success("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStrength("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not change password."
      );
    } finally {
      setChanging(false);
    }
  };

  const logoutDevices = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout from all devices?"
    );

    if (!confirmLogout) return;

    toast.success("Logged out from all devices.");
  };

  const passwordsMatch =
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-[#173331] bg-[#101C1B] p-6 shadow-lg"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#32E6A4]/15 p-3">
          <ShieldCheck className="h-6 w-6 text-[#32E6A4]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Security
          </h2>

          <p className="text-sm text-gray-400">
            Protect your account and manage authentication.
          </p>
        </div>
      </div>

      <div className="space-y-5">

        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          visible={showCurrent}
          toggle={() => setShowCurrent(!showCurrent)}
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={handleNewPassword}
          visible={showNew}
          toggle={() => setShowNew(!showNew)}
        />

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          visible={showConfirm}
          toggle={() => setShowConfirm(!showConfirm)}
        />

        <div>

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm text-gray-400">
              Password Strength
            </span>

            <span
              className={`text-sm font-semibold ${
              strength === "Strong"
              ? "text-green-400"
              : strength === "Medium"
              ? "text-yellow-400"
              : strength === "Weak"
              ? "text-red-400"
              : "text-gray-400"
             }`}
             >
             {strength || "Not Set"}
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#173331]">

           {strength && (
           <div
             className={`h-full transition-all duration-300 ${
             strength === "Weak"
             ? "w-1/3 bg-red-500"
             : strength === "Medium"
             ? "w-2/3 bg-yellow-500"
             : "w-full bg-green-500"
             }`}
             />
             )}
            </div>

        </div>

        {confirmPassword.length > 0 && (
          <p
            className={`text-sm ${
              passwordsMatch
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {passwordsMatch
              ? "✓ Passwords match"
              : "✗ Passwords do not match"}
          </p>
        )}

      </div>

      <div className="mt-8 space-y-5">

        <ToggleCard
          icon={<Smartphone size={20} />}
          title="Two-Factor Authentication"
          subtitle="Require a verification code when signing in."
          checked={security.twoFactor}
          onChange={() => handleToggle("twoFactor")}
        />

        <ToggleCard
          icon={<ShieldCheck size={20} />}
          title="Login Alerts"
          subtitle="Receive alerts for new device logins."
          checked={security.loginAlerts}
          onChange={() => handleToggle("loginAlerts")}
        />

      </div>

      <div className="mt-8 flex flex-wrap gap-4">

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={changing}
          className="rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {changing ? "Changing..." : "Change Password"}
        </button>

        <button
          type="button"
          onClick={logoutDevices}
          className="flex items-center gap-2 rounded-xl border border-red-500 px-6 py-3 font-medium text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Logout All Devices
        </button>

      </div>

    </motion.div>
  );
}

function PasswordInput({ label, value, onChange, visible, toggle }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={label}
          className="w-full rounded-xl border border-[#173331] bg-[#0E1615] px-4 py-3 pr-12 text-white outline-none transition focus:border-[#32E6A4]"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#32E6A4]"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function ToggleCard({ icon, title, subtitle, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#173331] bg-[#0E1615] p-5 transition hover:border-[#32E6A4]/40">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-[#32E6A4]/15 p-3 text-[#32E6A4]">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="text-sm text-gray-400">
            {subtitle}
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-7 w-14 rounded-full transition ${
          checked ? "bg-[#32E6A4]" : "bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
            checked ? "right-1" : "left-1"
          }`}
        />
      </button>

    </div>
  );
}