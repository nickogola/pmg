import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    rentDue: 1200.00,
    dueDate: '2023-11-01',
    balanceDue: 1200.00
  });
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    // Simulate API call to get payment information
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
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
    
    setProcessing(true);
    
    try {
      // Simulate API call for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentComplete(true);
    } catch (error) {
      setErrors({ submit: 'Payment processing failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Make a Payment</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Pay your rent or other fees securely online.
          </p>
        </div>

        {paymentComplete ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Payment successful!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your payment of ${formData.amount} has been processed successfully.</p>
                    <p className="mt-1">A receipt has been sent to your email.</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        type="button"
                        onClick={() => navigate('/tenant/dashboard')}
                        className="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                      >
                        Return to dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Rent Due</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">${paymentData.rentDue.toFixed(2)}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{paymentData.dueDate}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Balance Due</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-900 sm:col-span-2 sm:mt-0">${paymentData.balanceDue.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                {/* Payment Amount */}
                <div className="mb-6">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Payment Amount *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-7 pr-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.amount ? 'border-red-300' : ''
                      }`}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                  {errors.amount && (
                    <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    <div className="flex items-center">
                      <input
                        id="creditCard"
                        name="paymentMethod"
                        type="radio"
                        value="creditCard"
                        checked={formData.paymentMethod === 'creditCard'}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="creditCard" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit / Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="bankAccount"
                        name="paymentMethod"
                        type="radio"
                        value="bankAccount"
                        checked={formData.paymentMethod === 'bankAccount'}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="bankAccount" className="ml-3 block text-sm font-medium text-gray-700">
                        Bank Account
                      </label>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'creditCard' && (
                  <div className="space-y-6">
                    {/* Card Number */}
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.cardNumber ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-2 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.expiryDate ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.expiryDate && (
                          <p className="mt-2 text-sm text-red-600">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          id="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.cvv ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.cvv && (
                          <p className="mt-2 text-sm text-red-600">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'bankAccount' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Bank account payment functionality is currently under development. Please use a credit card for now.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save payment info checkbox */}
                <div className="mb-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="savePaymentInfo"
                        name="savePaymentInfo"
                        type="checkbox"
                        checked={formData.savePaymentInfo}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="savePaymentInfo" className="font-medium text-gray-700">Save payment information</label>
                      <p className="text-gray-500">Save this payment method securely for future transactions.</p>
                    </div>
                  </div>
                </div>

                {/* Submit error */}
                {errors.submit && (
                  <div className="mb-6">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Submit buttons */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/tenant/dashboard')}
                    className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      processing ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {processing ? 'Processing...' : 'Make Payment'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
