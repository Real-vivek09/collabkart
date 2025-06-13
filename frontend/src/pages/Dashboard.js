import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaBars, FaTimes, FaProjectDiagram, FaTasks, FaBell, FaChartBar } from 'react-icons/fa';
import Button from '../components/Button';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState({
    projects: [],
    tasks: [],
    notifications: [],
    stats: { activeProjects: 0, completedProjects: 0, pendingTasks: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/dashboard/data');
        setData(data);
      } catch (err) {
        console.error('Dashboard data error:', err);
        toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: ['Active Projects', 'Completed Projects', 'Pending Tasks'],
    datasets: [
      {
        label: 'Stats',
        data: [data.stats.activeProjects, data.stats.completedProjects, data.stats.pendingTasks],
        backgroundColor: ['#FF007A', '#8B00FF', '#3B82F6'],
        borderColor: ['#FF007A', '#8B00FF', '#3B82F6'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#D1D5DB' } },
      title: { display: true, text: 'Dashboard Overview', color: '#D1D5DB' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#D1D5DB' } },
      x: { ticks: { color: '#D1D5DB' } },
    },
  };

  return (
    <div className="min-h-screen flex dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
      <Helmet>
        <title>Dashboard - CollabKart</title>
        <meta name="description" content="Manage your projects, tasks, and notifications on CollabKart's dashboard." />
      </Helmet>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 dark:bg-gray-900 light:bg-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 z-50`}
        role="navigation"
        aria-label="Dashboard sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-800 light:border-gray-200">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            CollabKart
          </Link>
          <button
            className="md:hidden text-gray-300 dark:text-gray-200 light:text-gray-700"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center p-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 light:hover:bg-gray-100 rounded-lg"
            aria-label="Dashboard overview"
          >
            <FaChartBar className="mr-2" /> Overview
          </Link>
          <Link
            to="/projects"
            className="flex items-center p-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 light:hover:bg-gray-100 rounded-lg"
            aria-label="Projects"
          >
            <FaProjectDiagram className="mr-2" /> Projects
          </Link>
          <Link
            to="/messaging"
            className="flex items-center p-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 light:hover:bg-gray-100 rounded-lg"
            aria-label="Messaging"
          >
            <FaBell className="mr-2" /> Messaging
          </Link>
          <Link
            to="/profile/edit"
            className="flex items-center p-2 text-gray-300 dark:text-gray-200 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 light:hover:bg-gray-100 rounded-lg"
            aria-label="Edit profile"
          >
            <FaTasks className="mr-2" /> Profile
          </Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:ml-64">
        <div className="container mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden text-gray-300 dark:text-gray-200 light:text-gray-700"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FaBars size={24} />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
                Welcome, {user?.displayName || 'User'}
              </h1>
            </div>
            <Button
              text="New Project"
              className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:scale-105 transform transition-transform shadow-neon"
              onClick={() => navigate('/projects/new')}
              aria-label="Create new project"
            />
          </header>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in">
                <h3 className="text-xl font-semibold text-pink-600 mb-2">Active Projects</h3>
                <p className="text-3xl font-bold text-white">{data.stats.activeProjects}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in delay-200">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">Completed Projects</h3>
                <p className="text-3xl font-bold text-white">{data.stats.completedProjects}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in delay-400">
                <h3 className="text-xl font-semibold text-blue-500 mb-2">Pending Tasks</h3>
                <p className="text-3xl font-bold text-white">{data.stats.pendingTasks}</p>
              </div>
            </div>
            {/* Chart */}
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in">
              <Bar data={chartData} options={chartOptions} aria-label="Dashboard stats chart" />
            </div>
            {/* Notifications */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in delay-200">
              <h3 className="text-xl font-semibold text-white mb-4">Notifications</h3>
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {data.notifications.map((notification) => (
                  <li key={notification.id} className="text-gray-300 border-b border-gray-700 pb-2">
                    <p>{notification.message}</p>
                    <p className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
            {/* Projects Table */}
            <div className="lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-4">Your Projects</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-2">Title</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Due Date</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.projects.map((project) => (
                      <tr key={project._id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="p-2">{project.title}</td>
                        <td className="p-2 capitalize">{project.status}</td>
                        <td className="p-2">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '-'}</td>
                        <td className="p-2">
                          <Link to={`/projects/${project._id}`} className="text-pink-600 hover:text-purple-700">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Tasks */}
            <div className="lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in delay-200">
              <h3 className="text-xl font-semibold text-white mb-4">Your Tasks</h3>
              <ul className="space-y-4">
                {data.tasks.map((task) => (
                  <li key={task.id} className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-2">
                    <div>
                      <p>{task.title}</p>
                      <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                    </div>
                    <span className={`text-sm capitalize ${task.status === 'pending' ? 'text-yellow-400' : 'text-green-500'}`}>
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;