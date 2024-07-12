import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header/Header';
import '../styles/Login/Login.css'
import '../styles/Global/Globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
