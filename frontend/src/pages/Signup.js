import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import Button from '../components/Button';

const Signup = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasSpecialChar.test(password)) {
      return 'Password must contain at least one special character.';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number.';
    }
    return '';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    // Validate name
    if (!formData.name.trim()) {
      setError('Name is required.');
      setLoading(false);
      return;
    }

    try {
      // Firebase signup
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // Save to MongoDB
      await axios.post('http://localhost:5001/api/users/register', {
        firebaseUid: user.uid,
        name: formData.name,
        email: formData.email,
        role,
        skills: formData.skills,
        companyName: formData.companyName,
      });

      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.log('Signup error:', err);
      const code = err.code || 'unknown-error';
      switch (code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak.');
          break;
        default:
          setError('Failed to sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
      <Helmet>
        <title>Sign Up - CollabKart</title>
        <meta name="description" content="Join CollabKart as a VNIT student or startup to collaborate on innovative projects." />
        <meta name="keywords" content="CollabKart, signup, VNIT, startups, collaboration" />
      </Helmet>
      <section className="flex-1 flex items-center py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto bg-gray-800 dark:bg-gray-900 light:bg-white rounded-xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800">
              Join CollabKart
            </h2>
            {/* Role Toggle */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setRole('student')}
                className={`px-6 py-3 rounded-l-lg text-sm font-semibold ${role === 'student' ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow-neon' : 'bg-gray-700 dark:bg-gray-800 light:bg-gray-200 text-gray-300 dark:text-gray-400 light:text-gray-700 hover:bg-gray-600'}`}
                aria-label="Select Student role"
              >
                Student
              </button>
              <button
                onClick={() => setRole('startup')}
                className={`px-6 py-3 rounded-r-lg text-sm font-semibold ${role === 'startup' ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow-neon' : 'bg-gray-700 dark:bg-gray-800 light:bg-gray-200 text-gray-300 dark:text-gray-400 light:text-gray-700 hover:bg-gray-600'}`}
                aria-label="Select Startup role"
              >
                Startup
              </button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Signup form">
              <div>
                <label htmlFor="name" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-600 transform hover:scale-105 transition-transform"
                  placeholder="Enter your name"
                  required
                  aria-required="true"
                />
              </div>
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
                />
              </div>
              {role === 'student' && (
                <div>
                  <label htmlFor="skills" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                    Skills
                  </label>
                  <input
                    id="skills"
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-transform"
                    placeholder="e.g., Python, react"
                  />
                  <p id="skills-info" className="text-gray-500 dark:text-gray-600 light:text-gray-500 text-sm mt-1">
                    Separate skills with commas.
                  </p>
                </div>
              )}
              {role === 'startup' && (
                <div>
                  <label htmlFor="companyName" className="block text-gray-300 dark:text-gray-400 light:text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="text"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 dark:border-gray-700 light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-transform"
                    placeholder="Company name"
                    required
                  />
                </div>
              )}
              {error && (
                <p id="form-error" className="text-red-600 text-sm animate-pulse" role="alert">
                  {error}
                </p>
              )}
              <Button
                text={loading ? <span className="animate-spin inline-block h-5 w-5 border-t-2 border-white rounded-full"></span> : 'Sign Up'}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white dark:text-white light:text-white-700 hover:scale-105 transform transition-transform shadow-neonshine"
                type="submit"
                disabled={loading}
                aria-label="Submit signup form"
              />
            </form>
            <p className="text-center text-gray-500 mt-6 dark:text-gray-500 light:text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-600 dark:text-pink-500 light:text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;