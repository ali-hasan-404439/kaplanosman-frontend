import { ReactNode } from "react";

interface TableComponentProps {
  headers: string[];
  children: ReactNode;
}

function TableComponent({ headers, children }: TableComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-visible">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-primary text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-left py-4 px-6 font-medium whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TableComponent;
