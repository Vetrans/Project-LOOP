import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BrainCircuit,
  Sparkles,
  Languages,
  Bot,
  Wand2,
  BadgeCheck,
} from "lucide-react";

export default function AIPreferences({
  ai,
  setAI,
}) {

  useEffect(() => {
    const saved = localStorage.getItem("aiPreferences");

    if (saved) {
      setAI(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const updated = {
      ...ai,
      [e.target.name]: e.target.value,
    };

    setAI(updated);

    localStorage.setItem(
      "aiPreferences",
      JSON.stringify(updated)
    );
  };

  const toggle = (field) => {
    const updated = {
      ...ai,
      [field]: !ai[field],
    };

    setAI(updated);

    localStorage.setItem(
      "aiPreferences",
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
      {/* Header */}

      <div className="mb-8 flex items-center gap-3">

        <div className="rounded-xl bg-[#32E6A4]/15 p-3">
          <BrainCircuit className="h-6 w-6 text-[#32E6A4]" />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            LOOP AI Preferences
          </h2>

          <p className="text-sm text-gray-400">
            Configure how the AI assistant works throughout the platform.
          </p>

        </div>

      </div>

      {/* Select Fields */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <SelectField
          icon={<Bot size={18} />}
          label="AI Model"
          name="model"
          value={ai.model || ""}
          onChange={handleChange}
          options={[
            "Claude 4",
            "Claude 3.7",
            "GPT-5",
          ]}
        />

        <SelectField
          icon={<Sparkles size={18} />}
          label="Response Style"
          name="responseStyle"
          value={ai.responseStyle || ""}
          onChange={handleChange}
          options={[
            "Professional",
            "Detailed",
            "Creative",
            "Concise",
          ]}
        />

        <SelectField
          icon={<Languages size={18} />}
          label="Language"
          name="language"
          value={ai.language || ""}
          onChange={handleChange}
          options={[
            "English",
            "Hindi",
          ]}
        />

      </div>

      {/* Toggles */}

      <div className="mt-8 space-y-5">

        <ToggleCard
          icon={<BrainCircuit size={20} />}
          title="Auto Summary"
          subtitle="Generate summaries automatically."
          checked={ai.autoSummary}
          onToggle={() => toggle("autoSummary")}
        />

        <ToggleCard
          icon={<Wand2 size={20} />}
          title="Smart Suggestions"
          subtitle="Recommend actions using AI."
          checked={ai.smartSuggestions}
          onToggle={() => toggle("smartSuggestions")}
        />

        <ToggleCard
          icon={<BadgeCheck size={20} />}
          title="Sentiment Analysis"
          subtitle="Automatically analyze customer sentiment."
          checked={ai.sentimentAnalysis}
          onToggle={() => toggle("sentimentAnalysis")}
        />

        <ToggleCard
          icon={<Sparkles size={20} />}
          title="Auto Categorization"
          subtitle="Categorize feedback automatically."
          checked={ai.autoCategorization}
          onToggle={() => toggle("autoCategorization")}
        />

      </div>

    </motion.div>
  );
}

function SelectField({
  icon,
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">

        <span className="text-[#32E6A4]">
          {icon}
        </span>

        {label}

      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#173331] bg-[#0E1615] px-4 py-3 text-white outline-none focus:border-[#32E6A4]"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}

function ToggleCard({
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