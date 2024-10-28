import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ClipboardItem } from './types';
import { MainInput } from './components/MainInput';
import { ItemList } from './components/ItemList';
import { Notification } from './components/Notification';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { useAuth } from './contexts/AuthContext';
import { maintenance } from './utils/maintenance';

export function App() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [notification, setNotification] = useState('');

  // 启动自动维护
  useEffect(() => {
    maintenance.startAutoMaintenance();
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddContent = (content: string) => {
    if (!content.trim()) return;

    const lines = content.split('\n').filter(line => line.trim());
    const newItems = lines.map(line => ({
      id: crypto.randomUUID(),
      content: line,
      createdAt: new Date()
    }));

    setItems(prev => [...newItems, ...prev]);
    showNotification('已添加内容');
  };

  const handleCopyItem = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showNotification('已复制到剪贴板');
    } catch (err) {
      showNotification('复制失败');
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {user && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userId={user.username}
          showNotification={showNotification}
        />
      )}

      <div className="min-h-screen">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">临时剪贴板</h1>
            <Header />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
          <MainInput onAddContent={handleAddContent} showNotification={showNotification} />
          <ItemList
            items={items}
            onCopy={handleCopyItem}
            onDelete={handleDeleteItem}
            showNotification={showNotification}
          />
        </div>
      </div>

      <Notification message={notification} />
    </div>
  );
}