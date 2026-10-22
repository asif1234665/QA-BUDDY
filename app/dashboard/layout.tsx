import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, minHeight: "100vh", background: "#f8fafc" }}>{children}</div>
    </div>
  );
}
