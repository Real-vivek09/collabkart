import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import Button from '../components/Button';
import Footer from '../views/Footer';

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
      const code = err.code || err?.message || 'unknown-error';
      if (code.includes('user-not-found')) {
        setError('User not found. Please check your email.');
      } else if (code.includes('wrong-password')) {
        setError('Incorrect password. Please try again.');
      } else {
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
      setError('Failed to send reset email. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            CollabKart
          </Link>
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
        </div>
      </header>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Log In
            </h2>
            {resetSent ? (
              <p className="text-green-600 text-center mb-4">
                Password reset email sent! Check your inbox.
              </p>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transform hover:scale-105 transition-transform"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transform hover:scale-105 transition-transform"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    text={loading ? 'Logging In...' : 'Log In'}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    type="submit"
                    disabled={loading}
                  />
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={handlePasswordReset}
                    className="text-blue-600 hover:underline text-sm"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <div className="border-t border-gray-300 flex-1"></div>
                  <span className="px-2 text-gray-600 text-sm">OR</span>
                  <div className="border-t border-gray-300 flex-1"></div>
                </div>
                <Button
                  text="Sign in with Google"
                  className="w-full mt-4 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 flex items-center justify-center space-x-2"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.327 0 3.905.932 4.805 1.738l3.28-3.281C17.98 1.389 15.373 0 12.24 0 5.424 0 .001 5.423.001 12.24s5.423 12.24 12.239 12.24c6.817 0 12.24-5.423 12.24-12.24 0-.813-.081-1.605-.24-2.374h-12.24z"
                    />
                  </svg>
                </Button>
              </>
            )}
            <p className="text-center text-gray-600 mt-4">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;