import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function SocialLogin() {
  const handleGoogleLogin = () => {
    toast.info("This feature is currently under development.", {
      description:
        "Google authentication will be available in a future update.",
    });
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#141C1C] py-3 transition hover:border-cyan-400"
    >
      <FcGoogle size={22} />
      Continue with Google
    </button>
  );
}