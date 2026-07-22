import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#081111] text-white">
      <div className="flex">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}