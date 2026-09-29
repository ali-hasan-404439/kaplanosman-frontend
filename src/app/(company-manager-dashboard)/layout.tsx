import DashboardLayout from "@/components/Layout/dashboardLayout";
import WithCompanyManager from "@/role-wrappers/WithCompanyManager";

export default function CompanyManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithCompanyManager>
      <DashboardLayout>
        <div className="print:hidden">{children}</div>
      </DashboardLayout>
    </WithCompanyManager>
  );
}
