import React, { createContext, useContext, useState } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    'app.title': '逐行剪贴板管理器',
    'app.subtitle': '管理您的剪贴板内容',
    'login.title': '请登录以继续使用',
    'login.register': '创建新账号',
    'login.username': '用户名',
    'login.password': '密码',
    'login.submit': '登录',
    'login.register.submit': '注册',
    'login.switchToRegister': '没有账号？点击注册',
    'login.switchToLogin': '已有账号？点击登录',
    'main.temporaryClipboard': '临时剪贴板',
    'main.paste': '读取剪贴板',
    'main.add': '添加到临时列表',
    'main.placeholder': '在此输入或粘贴内容，每行将被分开显示...',
    'folder.title': '永久存储',
    'folder.add': '添加到永久存储',
    'folder.empty': '暂无永久保存的内容',
    'folder.emptyHint': '添加的内容会永久保存在这里',
    'action.copy': '复制',
    'action.delete': '删除',
    'action.translate': '翻译',
    'action.logout': '退出登录'
  },
  en: {
    'app.title': 'Line-by-Line Clipboard Manager',
    'app.subtitle': 'Manage your clipboard content',
    'login.title': 'Please login to continue',
    'login.register': 'Create new account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.register.submit': 'Register',
    'login.switchToRegister': 'No account? Register',
    'login.switchToLogin': 'Have an account? Login',
    'main.temporaryClipboard': 'Temporary Clipboard',
    'main.paste': 'Paste from Clipboard',
    'main.add': 'Add to Temporary List',
    'main.placeholder': 'Type or paste content here, each line will be separated...',
    'folder.title': 'Permanent Storage',
    'folder.add': 'Add to Permanent Storage',
    'folder.empty': 'No permanent content yet',
    'folder.emptyHint': 'Added content will be saved here permanently',
    'action.copy': 'Copy',
    'action.delete': 'Delete',
    'action.translate': 'Translate',
    'action.logout': 'Logout'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}