import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ipInfo, setIpInfo] = useState(null);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpInfo(data);
      } catch (error) {
        console.error('Erro ao obter informações de IP:', error);
      }
    };

    fetchIpInfo();
  }, []);

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const vendor = navigator.vendor;
    const language = navigator.language;
    const deviceMemory = navigator.deviceMemory || 'unknown';
    const hardwareConcurrency = navigator.hardwareConcurrency || 'unknown';
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    return {
      userAgent,
      platform,
      vendor,
      language,
      deviceMemory,
      hardwareConcurrency,
      screenWidth,
      screenHeight,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const deviceInfo = getDeviceInfo();
    const fullInfo = {
      ...deviceInfo,
      ip: ipInfo?.ip || 'IP not available'
    };
    console.log('Device Info:', JSON.stringify(fullInfo));

    try {
      const response = await fetch('https://api.grupogorki.com.br/api/usuarios/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario: email, senha: password }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      const data = await response.json();
      const userDetails = {
        id: data.user.data.id,
        usuario: data.user.data.usuario,
        idCidade: data.user.data.idCidade,
        tipoUsuario: data.user.data.tipoUsuario,
      };

      login(data.token, userDetails);
      router.push('/home');


    } catch (error) {
      console.error('Erro na autenticação:', error.message);
      alert('Falha na autenticação: ' + error.message);
    }
  };

  return (
    <div className='body-login'>
      <img className='logo-login' src="https://styxx-public.s3.sa-east-1.amazonaws.com/logo_criarte_black.png" alt="Logo Criarte" />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="t1-register-button" type="button" onClick={() => router.push('/register')}>Cadastrar</button>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
