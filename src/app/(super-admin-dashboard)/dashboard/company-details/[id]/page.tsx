
import CompanyDetails from '@/components/modules/super-admin-dashboard/DashboardHome/CompanyDetails';
import React from 'react';

const CompanyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <div>
      <CompanyDetails id={id} />
    </div>
  );
};

export default CompanyDetailsPage;
