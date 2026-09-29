interface CustomerRowSkeletonProps {
  headers: number;
}

const CustomerRowSkeleton = ({ headers }: CustomerRowSkeletonProps) => {
  return (
    <tr className="border-b border-gray-100 bg-white">
      {Array.from({ length: headers }).map((_, idx) => (
        <td key={idx} className="py-4 px-6">
          <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
        </td>
      ))}
    </tr>
  );
};

export default CustomerRowSkeleton;
