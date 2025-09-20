import React, { useState, useEffect } from 'react';

const ManageTickets = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call to fetch tickets
    const loadTickets = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockTickets = [
            { id: 101, tenant: 'John Smith', unit: 'A101', issue: 'Leaking faucet', priority: 'Medium', status: 'Open', created: '2023-10-16', updated: '2023-10-16' },
            { id: 102, tenant: 'Emma Johnson', unit: 'B205', issue: 'Broken AC', priority: 'High', status: 'In Progress', created: '2023-10-15', updated: '2023-10-16' },
            { id: 103, tenant: 'Michael Brown', unit: 'C310', issue: 'Clogged drain', priority: 'Medium', status: 'Open', created: '2023-10-14', updated: '2023-10-14' },
            { id: 104, tenant: 'Sarah Davis', unit: 'A105', issue: 'Electrical outlet not working', priority: 'Low', status: 'Open', created: '2023-10-13', updated: '2023-10-13' },
            { id: 105, tenant: 'Robert Wilson', unit: 'B210', issue: 'Window won\'t close', priority: 'Medium', status: 'Resolved', created: '2023-10-10', updated: '2023-10-12' },
            { id: 106, tenant: 'Jennifer Martinez', unit: 'C315', issue: 'Door handle broken', priority: 'Low', status: 'Resolved', created: '2023-10-09', updated: '2023-10-11' },
            { id: 107, tenant: 'David Taylor', unit: 'A110', issue: 'Ceiling leak', priority: 'High', status: 'In Progress', created: '2023-10-12', updated: '2023-10-13' }
          ];
          setTickets(mockTickets);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading tickets:', error);
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // Filter tickets based on selected status
  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status.toLowerCase() === filter.toLowerCase());

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    // In a real app, this would make an API call
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: newStatus, updated: new Date().toISOString().split('T')[0] };
      }
      return ticket;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6 bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Tickets</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage all maintenance requests.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-medium text-gray-900">Filter tickets</h2>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('open')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'open'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => handleFilterChange('in progress')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'in progress'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleFilterChange('resolved')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'resolved'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
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
          ) : filteredTickets.length > 0 ? (
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
                      Issue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.tenant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            View
                          </button>

                          {ticket.status !== 'Resolved' && (
                            <select
                              className="text-sm border-gray-300 rounded-md"
                              value={ticket.status}
                              onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                            >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No tickets found matching the selected filter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTickets;
