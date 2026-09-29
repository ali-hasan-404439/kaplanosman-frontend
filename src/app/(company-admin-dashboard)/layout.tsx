import DashboardLayout from "@/components/Layout/dashboardLayout";
import WithCompanyAdmin from "@/role-wrappers/WithCompanyAdmin";

export default function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithCompanyAdmin>
      <DashboardLayout>
        <div className="print:hidden">{children}</div>
      </DashboardLayout>
    </WithCompanyAdmin>
  );
}
