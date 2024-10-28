import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  resetPassword: (username: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const users = storage.getUsers();
    const user = users[username];
    
    if (!user || user.passwordHash !== storage.hashPassword(password)) {
      throw new Error('用户名或密码错误');
    }

    setUser(user);
    storage.setCurrentUser(user);
  };

  const register = async (username: string, password: string) => {
    const users = storage.getUsers();
    
    if (users[username]) {
      throw new Error('用户名已存在');
    }

    const passwordHash = storage.hashPassword(password);
    const newUser = { username, passwordHash };
    
    storage.saveUser(username, passwordHash);
    setUser(newUser);
    storage.setCurrentUser(newUser);
  };

  const resetPassword = async (username: string, newPassword: string) => {
    const users = storage.getUsers();
    const user = users[username];
    
    if (!user) {
      throw new Error('用户不存在');
    }

    const passwordHash = storage.hashPassword(newPassword);
    const updatedUser = { ...user, passwordHash };
    
    storage.saveUser(username, passwordHash);
    setUser(null); // 重置密码后需要重新登录
    storage.setCurrentUser(null);
  };

  const logout = () => {
    setUser(null);
    storage.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}