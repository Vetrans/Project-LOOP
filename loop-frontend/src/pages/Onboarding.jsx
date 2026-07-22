import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, User, Building2, ArrowRight, ArrowLeft } from "lucide-react";

import ProfileSettings from "../components/settings/ProfileSettings";
import OrganizationSettings from "../components/settings/OrganizationSettings";
import { useAuth } from "../context/AuthContext";

const steps = [
  { key: "profile", title: "Your Profile", icon: User },
  { key: "organization", title: "Your Organization", icon: Building2 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    designation: "",
    department: "",
    avatarUrl: "",
  });

  const [organization, setOrganization] = useState({
    company: user?.workspace?.name || "",
    timezone: "Asia/Kolkata",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    language: "English",
    fiscalYear: "January - December",
  });

  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (!profile.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = async () => {
    if (!organization.company.trim()) {
      toast.error("Please enter your organization name.");
      return;
    }

    setSubmitting(true);

    try {
      await completeOnboarding({ profile, organization });
      toast.success("Welcome to LOOP AI!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not complete onboarding."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#081111] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#32E6A4] text-black">
            <Sparkles size={28} />
          </div>

          <h1 className="text-3xl font-bold">Let's set up your workspace</h1>
          <p className="mt-2 text-gray-400">
            A few quick details before you get started with LOOP AI.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const active = index === step;
            const done = index < step;

            return (
              <div key={s.key} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                      active || done
                        ? "border-[#32E6A4] bg-[#32E6A4]/15 text-[#32E6A4]"
                        : "border-[#173331] text-gray-500"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`text-xs ${
                      active ? "text-[#32E6A4]" : "text-gray-500"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="h-px w-16 bg-[#173331]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content — reusing the real Settings components directly */}
        {step === 0 && (
          <ProfileSettings profile={profile} setProfile={setProfile} />
        )}

        {step === 1 && (
          <OrganizationSettings
            organization={organization}
            setOrganization={setOrganization}
          />
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0 || submitting}
            className="flex items-center gap-2 rounded-xl border border-[#173331] px-6 py-3 text-white transition hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Finishing..." : "Finish Setup"}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}