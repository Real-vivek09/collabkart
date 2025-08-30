import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // or wherever your Firebase auth is

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add this custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
