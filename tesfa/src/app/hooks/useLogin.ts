
'use client';
import { useState } from 'react';
import { fetchLogin } from '../utils/loginUtils';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string; 
  role: string;
     
}

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse | null | undefined> => {

    setLoading(true);
    setError(null);

    try {
      const data = await fetchLogin(credentials);
      if(data?.token && data?.role){
        localStorage.setItem("authToken",data.token);
        localStorage.setItem("userRole", data.role);

        return{ token: data.token, role: data.role};
      }
     
    } catch (err) {
      setError((err as Error).message || 'Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;