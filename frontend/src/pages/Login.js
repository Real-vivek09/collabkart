import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import Button from '../components/Button';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.log('Login error:', err);
      const code = err.code || 'unknown-error';
      switch (code) {
        case 'auth/user-not-found':
          setError('User not found. Please check your email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        default:
          setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      console.log('Google Sign-In error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Please enter your email to reset password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetSent(true);
    } catch (err) {
      console.log('Password reset error:', err);
      const code = err.code || 'unknown-error';
      if (code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
      <Helmet>
        <title>Log In - CollabKart</title>
        <meta name="description" content="Log in to CollabKart to connect VNIT students with startups for innovative projects." />
        <meta name="keywords" content="CollabKart, login, VNIT, startups, collaboration" />
      </Helmet>
      <section className="flex-1 flex items-center py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto bg-gray-800 dark:bg-gray-900 light:bg-white rounded-xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800">
              Log In to CollabKart
            </h2>
            {resetSent ? (
              <p className="text-green-500 text-center mb-6 animate-fade-in">
                Password reset email sent! Check your inbox.
              </p>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login form">
                  <div>
                    <label htmlFor="email" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-600 transform hover:scale-105 transition-transform"
                      placeholder="Enter your email"
                      required
                      aria-required="true"
                      aria-describedby="email-error"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-700 transform hover:scale-105 transition-transform"
                      placeholder="Enter your password"
                      required
                      aria-required="true"
                      aria-describedby="password-error"
                    />
                  </div>
                  {error && (
                    <p id="form-error" className="text-red-500 text-sm animate-pulse" role="alert">
                      {error}
                    </p>
                  )}
                  <Button
                    text={loading ? <span className="animate-spin inline-block h-5 w-5 border-t-2 border-white rounded-full"></span> : 'Log In'}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
                    type="submit"
                    disabled={loading}
                    aria-label="Log in button"
                  />
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={handlePasswordReset}
                    className="text-purple-700 dark:text-purple-500 light:text-blue-600 hover:underline text-sm"
                    disabled={loading}
                    aria-label="Forgot password"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="border-t border-gray-600 dark:border-gray-700 light:border-gray-300 flex-1"></div>
                  <span className="px-3 text-gray-400 dark:text-gray-500 light:text-gray-600 text-sm">OR</span>
                  <div className="border-t border-gray-600 dark:border-gray-700 light:border-gray-300 flex-1"></div>
                </div>
                <Button
                  text="Sign in with Google"
                  className="w-full mt-6 bg-gray-700 dark:bg-gray-800 light:bg-white text-gray-200 dark:text-gray-300 light:text-gray-800 border border-gray-600 dark:border-gray-700 light:border-gray-300 hover:bg-gray-600 dark:hover:bg-gray-700 light:hover:bg-gray-100 flex items-center justify-center space-x-3 shadow-neon"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  aria-label="Sign in with Google"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.327 0 3.905.932 4.805 1.738l3.28-3.281C17.98 1.389 15.373 0 12.24 0 5.424 0 .001 5.423.001 12.24s5.423 12.24 12.239 12.24c6.817 0 12.24-5.423 12.24-12.24 0-.813-.081-1.605-.24-2.374h-12.24z"
                    />
                  </svg>
                </Button>
              </>
            )}
            <p className="text-center text-gray-400 dark:text-gray-500 light:text-gray-600 mt-6">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-pink-600 dark:text-pink-500 light:text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;