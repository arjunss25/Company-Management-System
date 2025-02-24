import React, { useState, useRef, useEffect } from 'react';
import {
  IoClose,
  IoCheckmarkCircle,
  IoWarning,
  IoRefreshCircle,
} from 'react-icons/io5';
import { SuperadminApi } from '../../Services/SuperadminApi';

const OtpVerificationModal = ({ isOpen, onClose, staffId }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const otpString = otp.join('');
      const response = await SuperadminApi.verifyOtp({
        email: staffId,
        otp: otpString,
      });

      if (response.status === 'Success') {
        setSuccess(true);
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify OTP');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      const response = await SuperadminApi.resendOtp({ email: staffId });
      if (response.status === 'Success') {
        setResendDisabled(true);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose} 
      />
      
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative z-10 shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose size={24} />
        </button>

        {success ? (
          <div className="text-center">
            <IoCheckmarkCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Verification Successful!</h3>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
            <p className="text-gray-600 mb-6">
              Please enter the 6-digit code sent to your email
            </p>

            <div className="flex gap-2 mb-6 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-semibold border-2 rounded-lg 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none 
                           transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 mb-4 bg-red-50 p-3 rounded-lg">
                <IoWarning />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || otp.some(digit => !digit)}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold 
                       hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 transition-all
                       disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg
                       hover:shadow-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className="text-blue-500 hover:text-blue-600 font-medium flex items-center 
                         justify-center gap-2 mx-auto disabled:text-gray-400
                         disabled:cursor-not-allowed transition-colors"
              >
                <IoRefreshCircle className={`w-5 h-5 ${resendDisabled ? 'animate-spin' : ''}`} />
                {resendDisabled ? (
                  `Resend OTP in ${countdown}s`
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationModal;
