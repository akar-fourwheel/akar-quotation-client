import React, { useState } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '../../utils/toast';

const CredentialModal = ({ isOpen, onClose, user }) => {
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateCredentials = async () => {
    if (!user || !user[1] || !user[0]) {
      showError('Please select a valid user');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/admin/generate-credentials', {
        name: user[1], // Full name
        phone: user[0], // Using userId as phone for now
        role: 'sales'
      });

      if (res.data.success) {
        setCredentials({
          userId: res.data.credentials.userId,
          password: res.data.credentials.password
        });
        setGenerated(true);
        showSuccess('Credentials generated successfully');
      } else {
        showError('Failed to generate credentials');
      }
    } catch (error) {
      console.error('Error generating credentials:', error);
      showError('Failed to generate credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess(`${type} copied to clipboard`);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showSuccess(`${type} copied to clipboard`);
    }
  };

  const handleClose = () => {
    setCredentials({ userId: '', password: '' });
    setGenerated(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Generate Credentials
                </h3>
                <p className="text-indigo-100 text-sm">
                  Create secure login credentials
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* User Info */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Selected User</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">User ID</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user ? user[0] : 'N/A'}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user ? user[1] : 'N/A'}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">Team Lead</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user ? user[2] : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Generated Credentials */}
          {generated && (
            <div className="space-y-4 transform transition-all duration-500 ease-in-out">
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">Generated Credentials</h4>
                </div>
                
                <div className="space-y-4">
                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={credentials.userId}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 text-gray-900 focus:outline-none font-mono text-sm"
                      />
                      <button
                        onClick={() => handleCopy(credentials.userId, 'User ID')}
                        className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                        title="Copy User ID"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={credentials.password}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 text-gray-900 focus:outline-none font-mono text-sm"
                      />
                      <button
                        onClick={() => handleCopy(credentials.password, 'Password')}
                        className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                        title="Copy Password"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Copy Both Button */}
                  <button
                    onClick={() => handleCopy(`User ID: ${credentials.userId}\nPassword: ${credentials.password}`, 'Credentials')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Both Credentials
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          {generated && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 transform transition-all duration-300 ease-in-out">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                    Important Security Notice
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Please save these credentials securely. They will not be displayed again and should be stored in a password manager.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Close
          </button>
          
          {!generated && (
            <button
              onClick={generateCredentials}
              disabled={loading}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Generate Credentials
                </span>
              )}
            </button>
          )}
          
          {generated && (
            <button
              onClick={generateCredentials}
              disabled={loading}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate New
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialModal;