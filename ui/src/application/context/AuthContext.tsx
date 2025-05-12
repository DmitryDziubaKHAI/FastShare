import { createContext, useContext, useEffect, useState } from 'react';
import { UserData } from '@/application/interfaces/IUserData';
 

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (user: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const login = (user: UserData) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    });
  };

  useEffect(() => {
    fetch('http://localhost:3000/check-auth', {
      method: 'GET',
      credentials: 'include'
    })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUser({ id: data.userId, email: 'session@local' }); // email не приходить — умовно
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
