import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import SocialLogin from "./SocialLogin";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    workspace: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!form.workspace.trim()) {
      toast.error("Please enter your organization name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await signup({ name: form.name, workspace: form.workspace, email: form.email, password: form.password });
      toast.success("Account created successfully!");
      // Part 2 of signup: mandatory onboarding, not the dashboard.
      navigate("/onboarding");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create your account.");
    }
  };

  return (
    <div className="w-full max-w-md">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Create Account
        </h1>

        <p className="mt-2 text-gray-400">
          Join LOOP AI and start analyzing customer feedback.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>

          <label htmlFor="workspace" className="mb-2 block text-sm text-gray-300">Organization</label>
          <input id="workspace" name="workspace" value={form.workspace} onChange={handleChange} placeholder="Acme Corp" className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none transition focus:border-cyan-400" />

        </div>

        <div>

          <label
            htmlFor="name"
            className="mb-2 block text-sm text-gray-300"
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full rounded-xl border border-white/10 bg-[#141C1C] px-4 py-3 outline-none transition focus:border-cyan-400"
          />

        </div>

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
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
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
  autoComplete="new-password"
  value={form.password}
  onChange={(e) =>
    setForm({
      ...form,
      password: e.target.value,
    })
  }
/>

        </div>

        <div>

          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm text-gray-300"
          >
            Confirm Password
          </label>

          <PasswordInput
  id="confirmPassword"
  name="confirmPassword"
  autoComplete="new-password"
  value={form.confirmPassword}
  onChange={(e) =>
    setForm({
      ...form,
      confirmPassword: e.target.value,
    })
  }
/>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold transition hover:bg-cyan-400"
        >
          Create Account
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

        Already have an account?

        <Link
          to="/login"
          className="ml-2 text-cyan-400 hover:text-cyan-300"
        >
          Login
        </Link>

      </p>

    </div>
  );
}