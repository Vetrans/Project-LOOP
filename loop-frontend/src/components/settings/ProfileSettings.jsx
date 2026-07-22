import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Camera,
  Mail,
  Phone,
  Building2,
  Briefcase,
  User,
} from "lucide-react";

export default function ProfileSettings({
  profile,
  setProfile,
}) {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState("");

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");

    if (savedImage) {
      setPreview(savedImage);
    }
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.success("Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
      localStorage.setItem("profileImage", reader.result);
    };

    reader.readAsDataURL(file);
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
          <User className="h-6 w-6 text-[#32E6A4]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Profile Information
          </h2>

          <p className="text-sm text-gray-400">
            Update your personal information.
          </p>
        </div>
      </div>

      <div className="mb-10 flex flex-col items-center">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover border-4 border-[#32E6A4] shadow-xl"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#32E6A4] to-[#10B981] text-4xl font-bold text-black shadow-xl">
              {profile.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
          )}

          <button
            type="button"
            onClick={openFilePicker}
            className="absolute bottom-1 right-1 rounded-full bg-[#32E6A4] p-2 text-black shadow-lg transition hover:scale-110"
          >
            <Camera size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={openFilePicker}
          className="mt-4 rounded-xl border border-[#32E6A4]/30 px-5 py-2 text-sm font-medium text-[#32E6A4] transition hover:bg-[#173331]"
        >
          Upload Photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputField
          icon={<User size={18} />}
          label="Full Name"
          name="name"
          value={profile.name || ""}
          onChange={handleChange}
        />

        <InputField
          icon={<Mail size={18} />}
          label="Email"
          name="email"
          value={profile.email || ""}
          onChange={handleChange}
        />

        <InputField
          icon={<Phone size={18} />}
          label="Phone"
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
        />

        <InputField
          icon={<Briefcase size={18} />}
          label="Designation"
          name="designation"
          value={profile.designation || ""}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <InputField
            icon={<Building2 size={18} />}
            label="Department"
            name="department"
            value={profile.department || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </motion.div>
  );
}

function InputField({
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