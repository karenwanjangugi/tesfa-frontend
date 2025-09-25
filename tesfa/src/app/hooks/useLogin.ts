
'use client';
import { useState } from 'react';
import { fetchLogin } from '../utils/loginUtils';
import { useRouter } from 'next/navigation';


interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string; 
  role: string;
     
}

const useLogin = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse | null | undefined> => {

    setLoading(true);
    setError(null);

    try {
      const data = await fetchLogin(credentials);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role);

      if(data.role === "admin"){
        router.push("/admin/dashboard");

      }else{
        router.push("/dashboard");
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