import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const verificarSesion = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUsuario = localStorage.getItem('usuario');
      
      if (!storedToken || !storedUsuario) {
        setIsLoading(false);
        return;
      }
      
      // Verificar el token con el backend
      try {
        const response = await fetch('http://localhost:3000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        if (response.ok) {
          // Token válido
          setToken(storedToken);
          setUsuario(JSON.parse(storedUsuario));
        } else {
          // Token inválido, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      } finally {
        setIsLoading(false);
      }
    };
    
    verificarSesion();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al iniciar sesión');
      }
      
      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      setToken(data.token);
      setUsuario(data.usuario);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      isAuthenticated: !!usuario,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};