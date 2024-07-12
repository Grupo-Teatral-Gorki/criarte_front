import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserDetails = localStorage.getItem('userDetails');

    if (storedToken) {
      setAuthToken(storedToken);
    }

    if (storedUserDetails) {
      try {
        const parsedUserDetails = JSON.parse(storedUserDetails);
        setUserDetails(parsedUserDetails);
      } catch (error) {
        console.error('Erro ao analisar userDetails do localStorage:', error);
        localStorage.removeItem('userDetails');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token, user) => {
    setAuthToken(token);
    setUserDetails(user);

    localStorage.setItem('authToken', token);
    try {
      localStorage.setItem('userDetails', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao serializar userDetails para localStorage:', error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUserDetails(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
  };

  return (
    <AuthContext.Provider value={{ authToken, userDetails, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
