import React from "react";
import { AuthProvider } from "../context/AuthContext";
import "../styles/Login/Login.css";
import "../styles/Global/Globals.css";
import "../styles/meusProjetos/meusProjetos.css";
import "../styles/painel/painel.css";
import "../styles/Home/Home.css";
import GoogleTag from "../components/GoolgeTag";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <GoogleTag></GoogleTag>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
