import OrderViewDetailsPageComponent from "@/components/modules/company-manager-dashboard/OrderPageComponent/OrderViewDetailsPageComponent";


function CompanyManagerDashboardOrderViewDetails({ params }: any) {
  return <OrderViewDetailsPageComponent order_id={params.order_id} />;
}

export default CompanyManagerDashboardOrderViewDetails;
