import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Sidebar from '../views/Sidebar';
import Button from '../components/Button';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Welcome, {user?.displayName || user?.email}
            </h1>
            <div className="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/40"
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <Button
                text="Logout"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Your Profile
                </h2>
                <p className="text-gray-600 mb-2">
                  <strong>Name:</strong> {user?.displayName || 'N/A'}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Role:</strong> Student/Startup (TBD)
                </p>
                <Button
                  text="Edit Profile"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                />
              </div>
              {/* Project Overview */}
              <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Project Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Projects</span>
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed Projects</span>
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Payments</span>
                    <span className="text-blue-600 font-bold">₹5,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
