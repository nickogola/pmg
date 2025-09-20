import React, { useState, useEffect } from 'react';

const PaymentReports = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0
  });
  const [filter, setFilter] = useState({
    status: 'all',
    dateRange: 'month',
    startDate: '',
    endDate: ''
  });
  const [customDateRange, setCustomDateRange] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch payment data
    const loadPayments = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockPayments = [
            { id: 201, tenant: 'John Smith', unit: 'A101', amount: 1200, status: 'Paid', date: '2023-10-01', type: 'Rent' },
            { id: 202, tenant: 'Emma Johnson', unit: 'B205', amount: 1400, status: 'Pending', date: '2023-10-01', type: 'Rent' },
            { id: 203, tenant: 'Michael Brown', unit: 'C310', amount: 1100, status: 'Paid', date: '2023-10-02', type: 'Rent' },
            { id: 204, tenant: 'Sarah Davis', unit: 'A105', amount: 1200, status: 'Overdue', date: '2023-09-01', type: 'Rent' },
            { id: 205, tenant: 'Robert Wilson', unit: 'B210', amount: 1300, status: 'Paid', date: '2023-10-01', type: 'Rent' },
            { id: 206, tenant: 'Jennifer Martinez', unit: 'C315', amount: 1250, status: 'Paid', date: '2023-10-03', type: 'Rent' },
            { id: 207, tenant: 'David Taylor', unit: 'A110', amount: 1200, status: 'Pending', date: '2023-10-01', type: 'Rent' },
            { id: 208, tenant: 'John Smith', unit: 'A101', amount: 100, status: 'Paid', date: '2023-09-15', type: 'Utility' },
            { id: 209, tenant: 'Emma Johnson', unit: 'B205', amount: 120, status: 'Paid', date: '2023-09-15', type: 'Utility' },
            { id: 210, tenant: 'Michael Brown', unit: 'C310', amount: 90, status: 'Paid', date: '2023-09-16', type: 'Utility' }
          ];
          
          setPayments(mockPayments);
          
          // Calculate summary
          const totalPaid = mockPayments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);
            
          const totalPending = mockPayments
            .filter(p => p.status === 'Pending')
            .reduce((sum, p) => sum + p.amount, 0);
            
          const totalOverdue = mockPayments
            .filter(p => p.status === 'Overdue')
            .reduce((sum, p) => sum + p.amount, 0);
            
          setSummary({
            totalPayments: mockPayments.length,
            paidAmount: totalPaid,
            pendingAmount: totalPending,
            overdueAmount: totalOverdue
          });
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading payments:', error);
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  // Filter payments based on selected criteria
  const filteredPayments = payments.filter(payment => {
    // Filter by status
    if (filter.status !== 'all' && payment.status.toLowerCase() !== filter.status.toLowerCase()) {
      return false;
    }
    
    // Filter by date range
    if (customDateRange) {
      if (filter.startDate && new Date(payment.date) < new Date(filter.startDate)) {
        return false;
      }
      if (filter.endDate && new Date(payment.date) > new Date(filter.endDate)) {
        return false;
      }
    } else {
      const today = new Date();
      let compareDate = new Date(payment.date);
      
      if (filter.dateRange === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        if (compareDate < oneWeekAgo) {
          return false;
        }
      } else if (filter.dateRange === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        if (compareDate < oneMonthAgo) {
          return false;
        }
      } else if (filter.dateRange === 'quarter') {
        const oneQuarterAgo = new Date();
        oneQuarterAgo.setMonth(today.getMonth() - 3);
        if (compareDate < oneQuarterAgo) {
          return false;
        }
      }
    }
    
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
    
    if (name === 'dateRange' && value === 'custom') {
      setCustomDateRange(true);
    } else if (name === 'dateRange') {
      setCustomDateRange(false);
    }
  };

  // Calculate filtered summary
  const filteredSummary = {
    totalPayments: filteredPayments.length,
    paidAmount: filteredPayments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: filteredPayments
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: filteredPayments
      .filter(p => p.status === 'Overdue')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6 bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Reports</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage all payment transactions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Total Payments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <span className="h-6 w-6 text-white">💰</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Payments</dt>
                  <dd>
                    {loading ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">{filteredSummary.totalPayments}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Paid Amount */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <span className="h-6 w-6 text-white">✓</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Paid Amount</dt>
                  <dd>
                    {loading ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">${filteredSummary.paidAmount.toFixed(2)}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <span className="h-6 w-6 text-white">⏳</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Amount</dt>
                  <dd>
                    {loading ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">${filteredSummary.pendingAmount.toFixed(2)}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <span className="h-6 w-6 text-white">⚠️</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue Amount</dt>
                  <dd>
                    {loading ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">${filteredSummary.overdueAmount.toFixed(2)}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                id="status"
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                id="dateRange"
                name="dateRange"
                value={filter.dateRange}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {/* Export Button */}
            <div className="flex items-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export Report
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {customDateRange && (
            <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filter.startDate}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filter.endDate}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-pulse flex space-x-4 w-full">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.tenant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                        <button>View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No payments found matching the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentReports;
