import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Password",
  autoComplete = "current-password",
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 pr-12 text-white outline-none transition focus:border-cyan-400"
      />

      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-cyan-400"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}