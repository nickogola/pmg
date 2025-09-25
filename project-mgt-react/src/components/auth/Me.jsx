import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

const Me = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <p className="text-gray-700">You are not logged in.</p>
        <div className="mt-4">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <Link to="/logout" className="text-sm text-red-600 hover:text-red-800">Logout</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-gray-500 text-sm">Name</div>
          <div className="font-medium">{user.firstName} {user.lastName}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Role</div>
          <div className="font-medium">{user.userType}</div>
        </div>
        {user.phoneNumber && (
          <div>
            <div className="text-gray-500 text-sm">Phone</div>
            <div className="font-medium">{user.phoneNumber}</div>
          </div>
        )}
        {user.unitId && (
          <div>
            <div className="text-gray-500 text-sm">Unit</div>
            <div className="font-medium">{user.unitId}</div>
          </div>
        )}
        {user.propertyId && (
          <div>
            <div className="text-gray-500 text-sm">Property</div>
            <div className="font-medium">{user.propertyId}</div>
          </div>
        )}
      </div>
      <div className="mt-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">Back to Home</Link>
      </div>
    </div>
  );
};

export default Me;
