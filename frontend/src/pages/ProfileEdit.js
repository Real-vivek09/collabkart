import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { auth } from '../firebase';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Button from '../components/Button';

const ProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: '', role: '', skills: '', companyName: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const { data } = await axios.get(`http://localhost:5001/api/users/profile/${currentUser.uid}`);
          setProfile({
            name: data.name || '',
            role: data.role || '',
            skills: data.skills ? data.skills.join(', ') : '',
            companyName: data.companyName || '',
          });
        } catch (err) {
          console.error('Profile fetch error:', err);
          toast.error('Failed to load profile');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!profile.name.trim()) {
      setError('Name is required');
      setSubmitting(false);
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/users/profile/${user.uid}`, {
        name: profile.name,
        skills: profile.skills,
        companyName: profile.companyName,
      });
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Failed to update profile');
      setError('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-black light:bg-gray-100">
        <div className="text-white dark:text-gray-200 light:text-gray-800 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
      <Helmet>
        <title>Edit Profile - CollabKart</title>
        <meta name="description" content="Update your CollabKart profile details." />
        <meta name="keywords" content="CollabKart, profile, edit, VNIT" />
      </Helmet>
      <Toaster position="top-right" />
      <section className="flex-1 flex items-center py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto bg-gray-800 dark:bg-gray-900 light:bg-white rounded-xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Profile edit form">
              <div>
                <label htmlFor="name" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-600 transform hover:scale-105 transition-transform"
                  placeholder="Enter your name"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                  Email (Read-only)
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-600 dark:bg-gray-700 light:bg-gray-200 text-gray-400 cursor-not-allowed"
                  aria-label="User email (read-only)"
                />
              </div>
              {profile.role === 'student' && (
                <div>
                  <label htmlFor="skills" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                    Skills
                  </label>
                  <input
                    id="skills"
                    type="text"
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-transform"
                    placeholder="e.g., Python, React"
                  />
                  <p className="text-gray-500 dark:text-gray-600 light:text-gray-500 text-sm mt-1">
                    Separate skills with commas.
                  </p>
                </div>
              )}
              {profile.role === 'startup' && (
                <div>
                  <label htmlFor="companyName" className="block text-gray-300 dark:text-gray-200 light:text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    value={profile.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600 dark:border-gray-700 light:border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-800 light:bg-white text-white dark:text-gray-200 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-transform"
                    placeholder="Enter company name"
                  />
                </div>
              )}
              {error && (
                <p className="text-red-600 text-sm animate-pulse" role="alert">
                  {error}
                </p>
              )}
              <Button
                text={submitting ? <span className="animate-spin inline-block h-5 w-5 border-t-2 border-white rounded-full"></span> : 'Save Changes'}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
                type="submit"
                disabled={submitting}
                aria-label="Save profile changes"
              />
            </form>
            <Button
              text="Cancel"
              className="w-full mt-4 bg-gray-600 text-white hover:bg-gray-700 hover:scale-105 transform transition-transform"
              onClick={() => navigate('/dashboard')}
              aria-label="Cancel and return to dashboard"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileEdit;