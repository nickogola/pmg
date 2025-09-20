import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const TenantDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Sample data - in a real app, this would come from API calls
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState({
    tickets: true,
    payments: true,
    announcements: true
  });

  useEffect(() => {
    // Mock data loading - replace with actual API calls
    const loadData = async () => {
      try {
        // In a real app, these would be API calls
        // Simulating API delay
        setTimeout(() => {
          setTickets([
            { id: 1, title: 'Leaking faucet', status: 'Open', createdAt: '2023-10-15' },
            { id: 2, title: 'Broken light fixture', status: 'In Progress', createdAt: '2023-10-10' },
            { id: 3, title: 'AC not working', status: 'Resolved', createdAt: '2023-09-28' }
          ]);
          setLoading(prev => ({ ...prev, tickets: false }));
        }, 800);

        setTimeout(() => {
          setPayments([
            { id: 101, type: 'Rent', amount: 1200.00, status: 'Paid', date: '2023-10-01' },
            { id: 102, type: 'Utility', amount: 150.00, status: 'Paid', date: '2023-10-02' },
            { id: 103, type: 'Rent', amount: 1200.00, status: 'Upcoming', date: '2023-11-01' }
          ]);
          setLoading(prev => ({ ...prev, payments: false }));
        }, 1000);

        setTimeout(() => {
          setAnnouncements([
            { id: 201, title: 'Building Maintenance', content: 'Water will be shut off from 10am-2pm on Saturday for maintenance.', date: '2023-10-12' },
            { id: 202, title: 'Holiday Schedule', content: 'Office will be closed on November 23-24 for Thanksgiving holiday.', date: '2023-10-05' }
          ]);
          setLoading(prev => ({ ...prev, announcements: false }));
        }, 1200);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Handle error states for each section
      }
    };

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Tenant'}!
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Here's an overview of your recent activity and important information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/tenant/create-ticket')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Ticket
              </button>
              <button
                onClick={() => navigate('/tenant/payment')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Make Payment
              </button>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Lease
              </button>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Contact Manager
              </button>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Announcements</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {loading.announcements ? (
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
            ) : announcements.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{announcement.title}</h3>
                          <p className="text-xs text-gray-500">{announcement.date}</p>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No announcements at this time.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {/* Recent Tickets */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Maintenance Requests</h2>
            <button
              onClick={() => navigate('/tenant/create-ticket')}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              New Request
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
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
                        Title
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
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ticket.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.title}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.createdAt}
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

        {/* Recent Payments */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Payments</h2>
            <button
              onClick={() => navigate('/tenant/payment')}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Make Payment
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
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
    </div>
  );
};

export default TenantDashboard;
