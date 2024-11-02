import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminPrivateRoute = ({ children }) => {
  const { authToken, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [userMail, setUserMail] = useState(null);

  const allowedUsers = [ 'contato@styxx.com.br', 'gaferreirainicial@gmail.com', 'analuzmira23@gmail.com', 'producaocultural@grupoteatralgorki.com']; // Lista de usuários permitidos

  useEffect(() => {
    // Garante que o código só rode no cliente
    if (typeof window !== 'undefined') {
      // Função para verificar o localStorage a cada 2 segundos
      const interval = setInterval(() => {
        const email = localStorage.getItem('userEmail'); // Atualiza a informação do localStorage

        // Atualiza o estado do email do usuário
        setUserMail(email);

        // Verifica se o email está na lista de permitidos e redireciona se não estiver
        if (email && !allowedUsers.includes(email) || email == null) {
          router.push('/home');
        }
      }, 1); // A cada 2 segundos

      // Limpa o intervalo quando o componente for desmontado
      return () => clearInterval(interval);
    }
  }, [router, allowedUsers]);

  if (isLoading || !authToken) {
    return null; // Se estiver carregando ou sem autenticação, não renderiza o conteúdo
  }

  return children; // Renderiza o conteúdo se o usuário for permitido
};

export default AdminPrivateRoute;
