import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/Feedback";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import AskLoop from "./pages/AskLoop";
import Team from "./pages/Team";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0B1212]" />;
  if (!user) return <Navigate to="/login" replace />;
  // New users can't reach any dashboard route until onboarding is done —
  // this is enforced here so typing /dashboard directly can't bypass it.
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;

  return children;
}

function OnboardingRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0B1212]" />;
  if (!user) return <Navigate to="/login" replace />;
  // Users who already onboarded (including seeded demo accounts) skip
  // straight past this page if they land on it.
  if (user.onboardingCompleted) return <Navigate to="/dashboard" replace />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/ask-loop" element={<ProtectedRoute><AskLoop /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;