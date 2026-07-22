import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Bell,
  Mail,
  Smartphone,
  ShieldCheck,
  BrainCircuit,
  CalendarDays,
} from "lucide-react";

export default function NotificationSettings({
  notifications,
  setNotifications,
}) {

  useEffect(() => {
    const saved = localStorage.getItem("notificationSettings");

    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const toggle = (field) => {
    const updated = {
      ...notifications,
      [field]: !notifications[field],
    };

    setNotifications(updated);

    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(updated)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-[#173331] bg-[#101C1B] p-6 shadow-lg"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#32E6A4]/15 p-3">
          <Bell className="h-6 w-6 text-[#32E6A4]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Notifications
          </h2>

          <p className="text-sm text-gray-400">
            Choose when and how you receive notifications.
          </p>
        </div>
      </div>

      <div className="space-y-5">

        <NotificationCard
          icon={<Mail size={20} />}
          title="Email Notifications"
          subtitle="Receive important updates via email."
          checked={notifications.email}
          onToggle={() => toggle("email")}
        />

        <NotificationCard
          icon={<Smartphone size={20} />}
          title="Push Notifications"
          subtitle="Get instant notifications on supported devices."
          checked={notifications.push}
          onToggle={() => toggle("push")}
        />

        <NotificationCard
          icon={<CalendarDays size={20} />}
          title="Weekly Reports"
          subtitle="Receive a weekly analytics summary."
          checked={notifications.weeklyReport}
          onToggle={() => toggle("weeklyReport")}
        />

        <NotificationCard
          icon={<BrainCircuit size={20} />}
          title="AI Alerts"
          subtitle="Get notified when LOOP AI generates insights."
          checked={notifications.aiAlerts}
          onToggle={() => toggle("aiAlerts")}
        />

        <NotificationCard
          icon={<ShieldCheck size={20} />}
          title="Security Alerts"
          subtitle="Receive alerts for suspicious account activity."
          checked={notifications.securityAlerts}
          onToggle={() => toggle("securityAlerts")}
        />

      </div>
    </motion.div>
  );
}

function NotificationCard({
  icon,
  title,
  subtitle,
  checked,
  onToggle,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#173331] bg-[#0E1615] p-4">

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
        onClick={onToggle}
        className={`relative h-7 w-14 rounded-full transition ${
          checked
            ? "bg-[#32E6A4]"
            : "bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked
              ? "right-1"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}