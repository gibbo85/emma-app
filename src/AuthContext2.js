import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Ensure this path is correct

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Function to get the current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      //console.log(session);
      setUser(session?.user ?? null);
    };

    // Initialize session
    getSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup function to remove auth state change listener
    return () => {
      // Check if authListener has an unsubscribe method
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, []);

// Sign Up
const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // The user will not be returned until they verify their email
  if (data?.user) {
    setUser(data.user); // Optional, might not be available until email verification
  }

  return data; // Return the data to handle post-signup UI
};

//Login
  const login = async (email, password) => {
    const { error, data: { session } } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(session.user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}











