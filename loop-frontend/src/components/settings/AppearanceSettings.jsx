import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Moon,
  Sun,
  Monitor,
  LayoutDashboard,
} from "lucide-react";

export default function AppearanceSettings({
  appearance,
  setAppearance,
}) {
  useEffect(() => {
    const saved = localStorage.getItem("appearanceSettings");

    if (saved) {
      setAppearance(JSON.parse(saved));
    }
  }, []);

  const saveAppearance = (updated) => {
    setAppearance(updated);
    localStorage.setItem(
      "appearanceSettings",
      JSON.stringify(updated)
    );
  };

  const updateField = (field, value) => {
    saveAppearance({
      ...appearance,
      [field]: value,
    });
  };

  const toggleCompact = () => {
    saveAppearance({
      ...appearance,
      compactMode: !appearance.compactMode,
    });
  };

  const themes = [
    {
      id: "Dark",
      icon: <Moon size={20} />,
      title: "Dark",
    },
    {
      id: "Light",
      icon: <Sun size={20} />,
      title: "Light",
    },
    {
      id: "System",
      icon: <Monitor size={20} />,
      title: "System",
    },
  ];

  const colors = [
    "#32E6A4",
    "#3B82F6",
    "#A855F7",
    "#F97316",
    "#EF4444",
    "#FACC15",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-[#173331] bg-[#101C1B] p-6 shadow-lg"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#32E6A4]/15 p-3">
          <Palette className="h-6 w-6 text-[#32E6A4]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Appearance
          </h2>

          <p className="text-sm text-gray-400">
            Customize the look and feel of LOOP AI.
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-white">
          Theme
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() =>
                updateField("theme", theme.id)
              }
              className={`rounded-2xl border p-5 transition ${
                appearance.theme === theme.id
                  ? "border-[#32E6A4] bg-[#32E6A4]/10"
                  : "border-[#173331] bg-[#0E1615]"
              }`}
            >
              <div className="mb-3 text-[#32E6A4]">
                {theme.icon}
              </div>

              <h4 className="font-semibold text-white">
                {theme.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-semibold text-white">
          Accent Color
        </h3>

        <div className="flex flex-wrap gap-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() =>
                updateField("accent", color)
              }
              className={`h-12 w-12 rounded-full border-4 transition ${
                appearance.accent === color
                  ? "scale-110 border-white"
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-[#173331] bg-[#0E1615] p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#32E6A4]/15 p-3 text-[#32E6A4]">
            <LayoutDashboard size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Compact Mode
            </h3>

            <p className="text-sm text-gray-400">
              Reduce spacing for a denser layout.
            </p>
          </div>
        </div>

        <button
          onClick={toggleCompact}
          className={`relative h-7 w-14 rounded-full transition ${
            appearance.compactMode
              ? "bg-[#32E6A4]"
              : "bg-gray-600"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              appearance.compactMode
                ? "right-1"
                : "left-1"
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
}