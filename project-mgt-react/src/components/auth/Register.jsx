import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: 'Tenant' // Default to Tenant
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    clearError();
  };

  const validateStep1 = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        // Redirect based on user type
        if (formData.userType === 'Tenant') {
          navigate('/tenant/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setFormErrors({ general: result.error });
      }
    } catch (err) {
      setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'
                } text-white`}>
                  1
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700">Account Info</div>
              </div>
              
              <div className="flex-1 mx-4 h-1 bg-gray-200">
                <div className={`h-full ${step > 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              </div>
              
              <div className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'
                } text-white`}>
                  2
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700">Security</div>
              </div>
            </div>
          </div>

          <form>
            {step === 1 && (
              <div className="space-y-6">
                {/* First Name field */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {formErrors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.firstName}</p>
                    )}
                  </div>
                </div>

                {/* Last Name field */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {formErrors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone Number field */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border ${
                        formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* User Type selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    I am a:
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          id="tenant"
                          name="userType"
                          type="radio"
                          value="Tenant"
                          checked={formData.userType === 'Tenant'}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="tenant" className="ml-2 block text-sm font-medium text-gray-700">
                          Tenant
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="landlord"
                          name="userType"
                          type="radio"
                          value="Landlord"
                          checked={formData.userType === 'Landlord'}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="landlord" className="ml-2 block text-sm font-medium text-gray-700">
                          Landlord
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next button */}
                <div>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {formErrors.password && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {formErrors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* General error message */}
                {(error || formErrors.general) && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {error || formErrors.general}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Back and Submit buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
