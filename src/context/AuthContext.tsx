import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => boolean;
  register: (username: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersDb, setUsersDb] = useState<Record<string, any>>({
    admin: { password: 'admin123', role: 'admin' }
  });

  const login = (username: string, pass: string) => {
    const account = usersDb[username];
    if (account && account.password === pass) {
      setUser({ id: username, username, role: account.role });
      return true;
    }
    return false;
  };

  const register = (username: string, pass: string) => {
    if (usersDb[username]) return false; // User exists
    setUsersDb(prev => ({ ...prev, [username]: { password: pass, role: 'user' } }));
    setUser({ id: username, username, role: 'user' });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
