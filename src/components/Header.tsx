import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitch } from './LanguageSwitch';
import { useLanguage } from '../contexts/LanguageContext';

export function Header() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return <LanguageSwitch />;
  }

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitch />
      <button
        onClick={logout}
        className="p-2 bg-white text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50 shadow-lg"
        title={t('action.logout')}
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}