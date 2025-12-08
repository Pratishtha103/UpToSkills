// src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Home, LogIn } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 rounded-full p-6">
            <ShieldX className="w-16 h-16 text-red-600" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-extrabold text-red-600 mb-2">
          403
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Access Denied
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          You don't have permission to access this page. Please log in with the correct account or contact support if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00BDA6] text-white rounded-lg font-medium hover:bg-[#009688] transition-colors shadow-md"
          >
            <LogIn className="w-5 h-5" />
            Go to Login
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Additional Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact us at{' '}
          <a href="mailto:support@uptoskills.com" className="text-[#00BDA6] hover:underline">
            support@uptoskills.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;