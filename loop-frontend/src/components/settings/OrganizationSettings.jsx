import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  CalendarDays,
  DollarSign,
  Languages,
  Clock3,
} from "lucide-react";

// Fully controlled by props — no localStorage. "Company Name" is a
// free-text field now (it used to be a fixed dropdown, which can't
// represent whatever name the user actually signed up with).
export default function OrganizationSettings({
  organization,
  setOrganization,
}) {
  const handleChange = (e) => {
    setOrganization({
      ...organization,
      [e.target.name]: e.target.value,
    });
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
          <Building2 className="h-6 w-6 text-[#32E6A4]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Organization
          </h2>

          <p className="text-sm text-gray-400">
            Configure organization-wide preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <TextInput
          icon={<Building2 size={18} />}
          label="Company Name"
          name="company"
          value={organization.company || ""}
          onChange={handleChange}
        />

        <SelectInput
          icon={<Clock3 size={18} />}
          label="Timezone"
          name="timezone"
          value={organization.timezone || ""}
          onChange={handleChange}
          options={[
            "Asia/Kolkata",
            "UTC",
            "America/New_York",
            "Europe/London",
          ]}
        />

        <SelectInput
          icon={<DollarSign size={18} />}
          label="Currency"
          name="currency"
          value={organization.currency || ""}
          onChange={handleChange}
          options={[
            "INR",
            "USD",
            "EUR",
            "GBP",
          ]}
        />

        <SelectInput
          icon={<CalendarDays size={18} />}
          label="Date Format"
          name="dateFormat"
          value={organization.dateFormat || ""}
          onChange={handleChange}
          options={[
            "DD/MM/YYYY",
            "MM/DD/YYYY",
            "YYYY-MM-DD",
          ]}
        />

        <SelectInput
          icon={<Languages size={18} />}
          label="Default Language"
          name="language"
          value={organization.language || ""}
          onChange={handleChange}
          options={[
            "English",
            "Hindi",
            "Spanish",
          ]}
        />

        <SelectInput
          icon={<Globe size={18} />}
          label="Fiscal Year"
          name="fiscalYear"
          value={organization.fiscalYear || ""}
          onChange={handleChange}
          options={[
            "January - December",
            "April - March",
            "July - June",
          ]}
        />

      </div>

    </motion.div>
  );
}

function TextInput({
  icon,
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
        <span className="text-[#32E6A4]">
          {icon}
        </span>

        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#173331] bg-[#0E1615] px-4 py-3 text-white outline-none transition focus:border-[#32E6A4]"
      />
    </div>
  );
}

function SelectInput({
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
        className="w-full rounded-xl border border-[#173331] bg-[#0E1615] px-4 py-3 text-white outline-none transition focus:border-[#32E6A4]"
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