import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#141C1C] py-3 transition hover:border-cyan-400"
    >
      <FcGoogle size={22} />
      Continue with Google
    </button>
  );
}