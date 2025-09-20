import React, { useState, useEffect } from 'react';

const Announcements = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sendEmail: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch announcements
    const loadAnnouncements = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockAnnouncements = [
            { id: 1, title: 'Building Maintenance', content: 'Water will be shut off from 10am-2pm on Saturday for maintenance.', date: '2023-10-12', author: 'Admin User' },
            { id: 2, title: 'Holiday Schedule', content: 'Office will be closed on November 23-24 for Thanksgiving holiday.', date: '2023-10-05', author: 'Admin User' },
            { id: 3, title: 'Parking Lot Repaving', content: 'The north parking lot will be closed next Monday through Wednesday for repaving. Please use visitor parking during this time.', date: '2023-09-28', author: 'Admin User' },
            { id: 4, title: 'Updated Security Protocols', content: 'We have implemented new security measures at all entrances. Please review the updated protocols in the tenant handbook.', date: '2023-09-15', author: 'Admin User' }
          ];
          setAnnouncements(mockAnnouncements);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading announcements:', error);
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content is too short (minimum 10 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new announcement to the list
      const newAnnouncement = {
        id: Math.max(...announcements.map(a => a.id), 0) + 1,
        title: formData.title,
        content: formData.content,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin User' // In real app, would come from authentication
      };
      
      setAnnouncements([newAnnouncement, ...announcements]);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        sendEmail: false
      });
      
      // Hide form
      setShowForm(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
      setErrors({ submit: 'Failed to create announcement. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAnnouncements(announcements.filter(a => a.id !== id));
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6 bg-white shadow overflow-hidden sm:rounded-lg mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Post and manage announcements for your properties.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showForm ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {/* New Announcement Form */}
      {showForm && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Announcement</h2>
            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                  placeholder="Announcement title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Content Field */}
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={5}
                  value={formData.content}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.content ? 'border-red-300' : ''
                  }`}
                  placeholder="Announcement details..."
                />
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              {/* Send Email Checkbox */}
              <div className="mb-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="sendEmail"
                      name="sendEmail"
                      type="checkbox"
                      checked={formData.sendEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="sendEmail" className="font-medium text-gray-700">Send email notification</label>
                    <p className="text-gray-500">Send email to all tenants about this announcement.</p>
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mb-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    submitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Posting...' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
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
                  </div>
                </div>
              </div>
            </div>
          ) : announcements.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="py-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">{announcement.date}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>{announcement.content}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Posted by: {announcement.author}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                        onClick={() => {
                          setFormData({
                            title: announcement.title,
                            content: announcement.content,
                            sendEmail: false
                          });
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 text-sm"
                        onClick={() => deleteAnnouncement(announcement.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No announcements found. Create one using the button above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
