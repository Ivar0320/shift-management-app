import React from 'react';
import type { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">シフト管理アプリ ログイン</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input 
              type="email" 
              defaultValue="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input 
              type="password" 
              defaultValue="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="pt-4 space-y-2">
            <button 
              onClick={() => onLogin('staff')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              スタッフとしてログイン
            </button>
            <button 
              onClick={() => onLogin('admin')}
              className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              管理者としてログイン
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};