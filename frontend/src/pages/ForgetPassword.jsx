import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setResetEmail } from '../redux/authSlice';
import axiosInstance from '../utils/axiosInstance';

function ForgetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
    setMessage(''); 
  };

  // Send OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      toast.info('Sending OTP...', {
        position: 'top-right',
        autoClose: 2000,
      });

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await res.json();
      
      if (data.success) {
        dispatch(setResetEmail(formData.email));
        setStep(2);
        toast.success('✅ OTP sent successfully! Check your email.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        setMessage('✅ OTP sent successfully! Check your email.');
      } else {
        toast.error(data.message || 'Failed to send OTP.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error('Network error. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  // Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      toast.info('Resetting password...', {
        position: 'top-right',
        autoClose: 2000,
      });

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        dispatch(setResetEmail(null));
        
        toast.success('Password reset successful! Redirecting to login...', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || 'Failed to reset password.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Network error. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <form onSubmit={sendOTP} className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <p className="text-gray-600 text-sm text-center -mt-4 mb-4">
              Enter your email to receive a One-Time Password (OTP).
            </p>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                placeholder="Email address"
                required
                disabled={loading}
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Email Address *
              </label>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`bg-cyan-500 hover:bg-cyan-600 text-white rounded-md px-6 py-2 font-medium transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        </form>
      );
    }

    if (step === 2) {
      // OTP & New Password Form ---
      return (
        <form onSubmit={resetPassword} className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <p className="text-gray-600 text-sm text-center -mt-4 mb-4">
              An OTP has been sent to <strong>{formData.email}</strong>.
            </p>
            <div className="relative">
              <input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                placeholder="Enter OTP"
                required
                disabled={loading}
                maxLength="6"
              />
              <label
                htmlFor="otp"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Enter OTP *
              </label>
            </div>

            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                placeholder="New Password"
                required
                disabled={loading}
              />
              <label
                htmlFor="newPassword"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                New Password *
              </label>
            </div>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                placeholder="Confirm Password"
                required
                disabled={loading}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Confirm New Password *
              </label>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`bg-cyan-500 hover:bg-cyan-600 text-white rounded-md px-6 py-2 font-medium transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
            
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setMessage(''); }}
                className="text-sm text-gray-600 hover:underline"
              >
                Didn't receive OTP? Go back.
              </button>
            </div>

          </div>
        </form>
      );
    }
  };

  return (
    <>
      <div
        className="login-page min-h-screen flex items-center justify-center p-6 overflow-y-auto"
        style={{
          background:
            "url('https://images.unsplash.com/photo-1623479322729-28b25c16b011?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format=fit=crop&w=1920&q=1280')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Wrapper */}
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center">
          {/* LEFT TEXT SECTION */}
          <div className="left-section lg:w-1/2 w-full lg:pr-12 mb-10 lg:mb-0 text-center lg:text-left">
            <h1 className="font-medium text-5xl text-white heading-text">
              Forgot Your Password?
            </h1>
            <p className="leading-relaxed mt-4 text-white sub-text">
              No problem. Just follow the steps on the right to securely reset your password. We'll have you back in your account in no time.
            </p>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="lg:w-1/2 w-full">
            <div className="relative py-3 sm:max-w-xl w-96 mx-auto form-container">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10 md:p-16">
                <div className="max-w-md mx-auto">
                  
                  <h1 className="text-2xl font-semibold text-center mb-6">
                    {step === 1 ? 'Reset Password' : 'Verify Your Account'}
                  </h1>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                      {error}
                    </div>
                  )}

                  {message && !error && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
                      {message}
                    </div>
                  )}
                  
                  {renderStep()}

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Remembered your password?{" "}
                      <Link
                        to="/login"
                        className="text-cyan-500 hover:underline font-medium"
                      >
                        Login
                      </Link>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;