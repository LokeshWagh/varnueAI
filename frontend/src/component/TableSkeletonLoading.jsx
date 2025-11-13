import React from 'react';

const SkeletonRow = () => (
  <tr className="bg-white animate-pulse">
    <td className="px-6 py-4">
      <div data-placeholder className="h-5 w-32 bg-gray-200 rounded-md overflow-hidden relative"></div>
    </td>
    <td className="px-6 py-4">
      <div data-placeholder className="h-5 w-48 bg-gray-200 rounded-md overflow-hidden relative"></div>
    </td>
    <td className="px-6 py-4">
      <div data-placeholder className="h-5 w-16 bg-gray-200 rounded-md overflow-hidden relative"></div>
    </td>
    <td className="px-6 py-4">
      <div data-placeholder className="h-5 w-24 bg-gray-200 rounded-md overflow-hidden relative"></div>
    </td>
    <td className="px-6 py-4">
      <div data-placeholder className="h-5 w-20 bg-gray-200 rounded-md overflow-hidden relative"></div>
    </td>
  </tr>
);


function TableSkeletonLoading() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div data-placeholder className="h-7 w-64 bg-gray-200 rounded-md overflow-hidden relative"></div>
            <div data-placeholder className="h-5 w-32 bg-gray-200 rounded-md overflow-hidden relative mt-2"></div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableSkeletonLoading;