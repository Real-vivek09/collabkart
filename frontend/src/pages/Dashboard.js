import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { auth } from '../firebase';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../views/Sidebar';
import Button from '../components/Button';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState({ active: 0, completed: 0, pendingPayments: 0 });
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Fetch user profile from MongoDB
          const { data } = await axios.get(`http://localhost:5001/api/users/profile/${currentUser.uid}`);
          setProfile(data);
          // Fetch project data
          const projectData = await axios.get(`http://localhost:5001/api/users/projects/${currentUser.uid}`);
          setProjects(projectData.data);
        } catch (err) {
          console.error('Data fetch error:', err);
          toast.error('Failed to load profile or projects');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    } finally {
      setLogoutLoading(false);
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
    <div className="min-h-screen flex dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
      <Helmet>
        <title>Dashboard - CollabKart</title>
        <meta name="description" content="Manage your CollabKart profile and projects." />
        <meta name="keywords" content="CollabKart, dashboard, VNIT, projects" />
      </Helmet>
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 dark:bg-gray-900 light:bg-white shadow-lg py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800">
              Welcome, {profile?.name || user?.email}
            </h1>
            <div className="flex items-center space-x-4">
              <img
                src={user?.photoURL || 'https://via.placeholder.com/40'}
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-pink-600 shadow-neon"
                aria-label="User profile picture"
              />
              <Button
                text={logoutLoading ? <span className="animate-spin inline-block h-5 w-5 border-t-2 border-white rounded-full"></span> : 'Logout'}
                className="bg-red-600 text-white hover:bg-red-700 shadow-neon hover:scale-105 transform transition-transform"
                onClick={handleLogout}
                disabled={logoutLoading}
                aria-label="Logout button"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="bg-gray-800 dark:bg-gray-900 light:bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-4">
                  Your Profile
                </h2>
                <p className="text-gray-300 dark:text-gray-200 light:text-gray-600 mb-2">
                  <strong>Name:</strong> {profile?.name || 'N/A'}
                </p>
                <p className="text-gray-300 dark:text-gray-200 light:text-gray-600 mb-2">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-gray-300 dark:text-gray-200 light:text-gray-600 mb-2">
                  <strong>Role:</strong> {profile?.role || 'N/A'}
                </p>
                {profile?.role === 'student' && (
                  <p className="text-gray-300 dark:text-gray-200 light:text-gray-600 mb-4">
                    <strong>Skills:</strong> {profile?.skills.join(', ') || 'None'}
                  </p>
                )}
                {profile?.role === 'startup' && (
                  <p className="text-gray-300 dark:text-gray-200 light:text-gray-600 mb-4">
                    <strong>Company:</strong> {profile?.companyName || 'N/A'}
                  </p>
                )}
                <Button
                  text="Edit Profile"
                  className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
                  onClick={() => navigate('/profile/edit')}
                  aria-label="Edit profile button"
                />
              </div>
              {/* Project Overview */}
              <div className="md:col-span-2 bg-gray-800 dark:bg-gray-900 light:bg-white rounded-xl shadow-lg p-6 animate-fade-in delay-200">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 dark:text-white light:text-gray-800 mb-4">
                  Project Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 dark:text-gray-200 light:text-gray-600">Active Projects</span>
                    <span className="text-pink-600 dark:text-pink-500 light:text-blue-600 font-bold">{projects.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 dark:text-gray-200 light:text-gray-600">Completed Projects</span>
                    <span className="text-pink-600 dark:text-pink-500 light:text-blue-600 font-bold">{projects.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 dark:text-gray-200 light:text-gray-600">Pending Payments</span>
                    <span className="text-pink-600 dark:text-pink-500 light:text-blue-600 font-bold">₹{projects.pendingPayments.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  text="View Projects"
                  className="mt-6 bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
                  onClick={() => navigate('/projects')}
                  aria-label="View projects button"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;