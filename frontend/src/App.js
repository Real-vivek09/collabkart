import React, { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { auth } from './firebase';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Navbar from './views/Navbar';
import Footer from './views/Footer';
import './styles/tailwind.css';

// Lazy-loaded pages
const Homepage = lazy(() => import('./pages/Homepage'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectList = lazy(() => import('./pages/ProjectList'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Messaging = lazy(() => import('./pages/Messaging'));
const Payment = lazy(() => import('./pages/Payment'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));

// Theme context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    console.log('Theme changed to:', theme); // Debug log
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      console.log('Toggling to:', newTheme); // Debug log
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await getIdToken(currentUser, true);
          setToken(idToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        } catch (err) {
          console.error('Token error:', err);
          toast.error('Authentication error');
        }
      } else {
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Protected route
const ProtectedRoute = ({ children }) => {
  const { user, loading, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600" aria-label="Loading"></div>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

// Error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught error:', errorInfo);
    toast.error('Something went wrong!');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 light:bg-gray-100 text-white dark:text-gray-200 light:text-gray-800">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-500 light:text-blue-600 mb-4">Something went wrong!</h1>
            <p className="text-gray-400 dark:text-gray-500 light:text-gray-600 mb-6">Please refresh or try again later.</p>
            <a
              href="/"
              className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transform hover:scale-105 transition-transform"
              aria-label="Return to homepage"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Layout component
const Layout = ({ children }) => {
  const location = useLocation();
  const protectedPaths = ['/dashboard', '/projects', '/projects/', '/messaging', '/payment', '/profile/edit'];

  const shouldShowNavbar = !protectedPaths.some((path) =>
    path.includes('*') ? location.pathname.startsWith(path.split('*')[0]) : location.pathname === path
  );

  return (
    <div className="flex flex-col min-h-screen dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>CollabKart - Collaborate & Innovate</title>
        <meta name="description" content="Join CollabKart to connect VNIT students and startups for innovative projects." />
        <meta name="keywords" content="CollabKart, VNIT, startups, collaboration, projects" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      {shouldShowNavbar && <Navbar />}
      <main className="flex-1" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// App component
function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ErrorBoundary>
              <Toaster position="top-right" />
              <ScrollToTop />
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b dark:from-black dark:to-blue-950 light:bg-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600" aria-label="Loading"></div>
                  </div>
                }
              >
                <Layout>
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/projects" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
                    <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
                    <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
                    <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                    <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Suspense>
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;