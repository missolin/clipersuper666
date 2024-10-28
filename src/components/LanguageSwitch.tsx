import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 bg-white text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 shadow-lg"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Globe className="w-5 h-5" />
    </button>
  );
}