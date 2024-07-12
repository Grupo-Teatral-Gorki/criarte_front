import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { authToken, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authToken) {
      router.push('/login');

    }
  }, [authToken, isLoading, router]);

  if (isLoading || !authToken) {
    return null;
  }

  return children;
};

export default PrivateRoute;
