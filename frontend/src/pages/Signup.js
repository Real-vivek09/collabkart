import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Footer from '../views/Footer';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      alert('Signup successful! Please log in.');
      // TODO: Save additional data (name, skills, companyName) to MongoDB via backend
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
      {/* Signup Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Join CollabKart
            </h2>
            {/* Role Toggle */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setRole('student')}
                className={`px-4 py-2 rounded-l-lg ${role === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Student
              </button>
              <button
                onClick={() => setRole('startup')}
                className={`px-4 py-2 rounded-r-lg ${role === 'startup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Startup
              </button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {role === 'student' && (
                <div>
                  <label className="block text-gray-700 mb-1">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g., Python, React"
                  />
                </div>
              )}
              {role === 'startup' && (
                <div>
                  <label className="block text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter company name"
                  />
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                text={loading ? 'Signing Up...' : 'Sign Up'}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                type="submit"
                disabled={loading}
              />
            </form>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Signup;