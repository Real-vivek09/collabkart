import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const uid = searchParams.get('uid');
    if (uid) {
      axios.get(`/users/verify-email?uid=${uid}`)
        .then(() => {
          toast.success('Email verified! Please log in.');
          navigate('/login');
        })
        .catch(() => {
          toast.error('Verification failed');
          navigate('/signup');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-blue-950">
      <p className="text-white text-xl">Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;
