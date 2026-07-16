import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute, RequirePermission } from "./components/RouteGuards";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Trends from "./pages/Trends";
import AskLoop from "./pages/AskLoop";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { NotFound, Forbidden } from "./pages/StatusPages";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forbidden" element={<Forbidden />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/ask" element={<AskLoop />} />
        <Route path="/reports" element={<Reports />} />
        <Route
          path="/settings"
          element={
            <RequirePermission permission="manage_members">
              <Settings />
            </RequirePermission>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
