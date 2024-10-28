import React, { useState } from 'react';
import { Clipboard, User, Lock, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('请填写用户名和密码');
      return;
    }

    try {
      switch (mode) {
        case 'register':
          await register(username, password);
          break;
        case 'reset':
          await resetPassword(username, password);
          setMode('login');
          break;
        default:
          await login(username, password);
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'register':
        return '创建新账号';
      case 'reset':
        return '重置密码';
      default:
        return '请登录以继续使用';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'register':
        return '注册';
      case 'reset':
        return '重置密码';
      default:
        return '登录';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full">
              <Clipboard className="w-16 h-16 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">逐行剪贴板管理器</h1>
          <p className="text-gray-600 text-lg">{getTitle()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>用户名</span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入用户名"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>{mode === 'reset' ? '新密码' : '密码'}</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={mode === 'reset' ? '请输入新密码' : '请输入密码'}
              />
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg
                     text-white bg-indigo-600 hover:bg-indigo-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                     transition-colors duration-200"
          >
            {getButtonText()}
          </button>

          <div className="flex justify-center gap-4 text-sm">
            {mode !== 'login' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                返回登录
              </button>
            )}
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  注册新账号
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setError('');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  找回密码
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}