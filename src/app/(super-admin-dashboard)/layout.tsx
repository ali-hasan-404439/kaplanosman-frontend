import DashboardLayout from "@/components/Layout/dashboardLayout";
import WithAdmin from "@/role-wrappers/WithAdmin";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAdmin>
      <DashboardLayout>{children}</DashboardLayout>
    </WithAdmin>
  );
}
