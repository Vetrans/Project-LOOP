import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import SocialLogin from "./SocialLogin";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      await login({ email, password });
      if (remember) localStorage.setItem("rememberMe", "true");
      else localStorage.removeItem("rememberMe");
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to log in.");
    }
  };

  return (
    <div className="w-full max-w-md">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-gray-400">
          Login to continue using LOOP AI.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>

          <label
            htmlFor="email"
            className="mb-2 block text-sm text-gray-300"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none transition focus:border-cyan-400"
          />

        </div>

        <div>

          <label
            htmlFor="password"
            className="mb-2 block text-sm text-gray-300"
          >
            Password
          </label>

           <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
           />

        </div>

        <div className="flex items-center justify-between">

          <label
            htmlFor="remember"
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-400"
          >
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              className="rounded"
            />

            Remember me
          </label>

          <Link
            to=""
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Forgot Password?
          </Link>

        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold transition hover:bg-cyan-400"
        >
          Login
        </button>

      </form>

      <div className="my-6 flex items-center gap-4">

        <div className="h-px flex-1 bg-white/10" />

        <span className="text-sm text-gray-500">
          OR
        </span>

        <div className="h-px flex-1 bg-white/10" />

      </div>

      <SocialLogin />

      <p className="mt-6 text-center text-gray-400">

        Don't have an account?

        <Link
          to="/register"
          className="ml-2 text-cyan-400 hover:text-cyan-300"
        >
          Sign Up
        </Link>

      </p>

    </div>
  );
}
