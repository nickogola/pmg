import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from API calls
  const [stats, setStats] = useState({
    properties: 0,
    units: 0,
    occupancyRate: 0,
    tenants: 0,
    openTickets: 0,
    pendingPayments: 0
  });

  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    tickets: true,
    payments: true,
    activity: true
  });

  useEffect(() => {
    // Mock data loading - replace with actual API calls
    const loadData = async () => {
      try {
        // Simulating API delay for stats
        setTimeout(() => {
          setStats({
            properties: 5,
            units: 24,
            occupancyRate: 92,
            tenants: 22,
            openTickets: 4,
            pendingPayments: 3
          });
          setLoading(prev => ({ ...prev, stats: false }));
        }, 800);

        // Simulating API delay for tickets
        setTimeout(() => {
          setTickets([
            { id: 101, tenant: 'John Smith', unit: 'A101', issue: 'Leaking faucet', priority: 'Medium', status: 'Open', date: '2023-10-16' },
            { id: 102, tenant: 'Emma Johnson', unit: 'B205', issue: 'Broken AC', priority: 'High', status: 'In Progress', date: '2023-10-15' },
            { id: 103, tenant: 'Michael Brown', unit: 'C310', issue: 'Clogged drain', priority: 'Medium', status: 'Open', date: '2023-10-14' },
            { id: 104, tenant: 'Sarah Davis', unit: 'A105', issue: 'Electrical outlet not working', priority: 'Low', status: 'Open', date: '2023-10-13' }
          ]);
          setLoading(prev => ({ ...prev, tickets: false }));
        }, 1000);

        // Simulating API delay for payments
        setTimeout(() => {
          setPayments([
            { id: 201, tenant: 'John Smith', unit: 'A101', amount: 1200, status: 'Paid', date: '2023-10-01' },
            { id: 202, tenant: 'Emma Johnson', unit: 'B205', amount: 1400, status: 'Pending', date: '2023-10-01' },
            { id: 203, tenant: 'Michael Brown', unit: 'C310', amount: 1100, status: 'Paid', date: '2023-10-02' },
            { id: 204, tenant: 'Sarah Davis', unit: 'A105', amount: 1200, status: 'Overdue', date: '2023-10-01' }
          ]);
          setLoading(prev => ({ ...prev, payments: false }));
        }, 1200);

        // Simulating API delay for recent activity
        setTimeout(() => {
          setRecentActivity([
            { id: 301, description: 'New tenant registration', user: 'David Wilson', date: '2023-10-16 14:30' },
            { id: 302, description: 'Maintenance ticket resolved', user: 'Admin User', date: '2023-10-16 11:15' },
            { id: 303, description: 'New payment received', user: 'System', date: '2023-10-15 09:45' },
            { id: 304, description: 'Lease updated', user: 'Admin User', date: '2023-10-14 16:20' },
            { id: 305, description: 'New announcement posted', user: 'Admin User', date: '2023-10-14 10:05' }
          ]);
          setLoading(prev => ({ ...prev, activity: false }));
        }, 1500);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Handle error states
      }
    };

    loadData();
  }, []);

  // Function to navigate to different sections
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Admin'}!
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Here's an overview of your properties and important information.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Properties */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <span className="h-6 w-6 text-white text-2xl">🏢</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Properties</dt>
                  <dd>
                    {loading.stats ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">{stats.properties}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button 
                onClick={() => navigateTo('/admin/properties')} 
                className="font-medium text-indigo-700 hover:text-indigo-900"
              >
                View all
              </button>
            </div>
          </div>
        </div>

        {/* Units */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <span className="h-6 w-6 text-white text-2xl">🏠</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Units</dt>
                  <dd>
                    {loading.stats ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">
                        {stats.units} ({stats.occupancyRate}% Occupied)
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button 
                onClick={() => navigateTo('/admin/units')} 
                className="font-medium text-indigo-700 hover:text-indigo-900"
              >
                View all
              </button>
            </div>
          </div>
        </div>

        {/* Tenants */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <span className="h-6 w-6 text-white text-2xl">👥</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tenants</dt>
                  <dd>
                    {loading.stats ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">{stats.tenants}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button 
                onClick={() => navigateTo('/admin/tenants')} 
                className="font-medium text-indigo-700 hover:text-indigo-900"
              >
                View all
              </button>
            </div>
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <span className="h-6 w-6 text-white text-2xl">🔧</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                  <dd>
                    {loading.stats ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">{stats.openTickets}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button 
                onClick={() => navigateTo('/admin/manage-tickets')} 
                className="font-medium text-indigo-700 hover:text-indigo-900"
              >
                View all
              </button>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <span className="h-6 w-6 text-white text-2xl">💰</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Payments</dt>
                  <dd>
                    {loading.stats ? (
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    ) : (
                      <div className="text-lg font-medium text-gray-900">{stats.pendingPayments}</div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button 
                onClick={() => navigateTo('/admin/payment-reports')} 
                className="font-medium text-indigo-700 hover:text-indigo-900"
              >
                View all
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button 
                onClick={() => navigateTo('/admin/announcements')} 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                New Announcement
              </button>
              <button 
                onClick={() => navigateTo('/admin/leases')} 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Manage Leases
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Maintenance Tickets */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Maintenance Tickets</h2>
            <button
              onClick={() => navigateTo('/admin/manage-tickets')}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              View All
            </button>
          </div>
          <div className="px-4 py-3 sm:p-6">
            {loading.tickets ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse flex space-x-4 w-full">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : tickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ticket.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.issue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 
                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No maintenance requests found.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="px-4 py-3 sm:p-6">
            {loading.activity ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse flex space-x-4 w-full">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : recentActivity.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-3">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{activity.description}</h3>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          By: {activity.user}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Payments</h2>
          <button
            onClick={() => navigateTo('/admin/payment-reports')}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            View All
          </button>
        </div>
        <div className="px-4 py-3 sm:p-6">
          {loading.payments ? (
            <div className="flex justify-center py-4">
              <div className="animate-pulse flex space-x-4 w-full">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.tenant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.unit}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No payment history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
