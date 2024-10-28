import React, { useState, useEffect } from 'react';
import { X, Trash2, Copy, FolderOpen, Plus } from 'lucide-react';
import { storage } from '../utils/storage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  showNotification: (message: string) => void;
}

export function Sidebar({ isOpen, onClose, userId, showNotification }: SidebarProps) {
  const [savedContents, setSavedContents] = useState<string[]>([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (userId && isOpen) {
      const contents = storage.loadContent(userId);
      setSavedContents(contents);
    }
  }, [userId, isOpen]);

  const handleAddContent = () => {
    if (!newContent.trim()) {
      showNotification('请先输入内容');
      return;
    }
    storage.saveContent(userId, newContent);
    setSavedContents(prev => [newContent, ...prev]);
    setNewContent('');
    showNotification('已添加到永久存储');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNewContent(text);
    } catch (err) {
      showNotification('无法读取剪贴板内容');
    }
  };

  const handleCopyItem = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showNotification('已复制到剪贴板');
    } catch (err) {
      showNotification('复制失败');
    }
  };

  const handleDeleteItem = (index: number) => {
    storage.deleteContent(userId, index);
    setSavedContents(prev => prev.filter((_, i) => i !== index));
    showNotification('已删除内容');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}
      
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">永久存储</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="输入要永久保存的内容..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handlePaste}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                读取剪贴板
              </button>
              <button
                onClick={handleAddContent}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加到永久存储
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {savedContents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">暂无永久保存的内容</p>
                <p className="text-sm text-gray-400 mt-2">添加的内容会永久保存在这里</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedContents.map((content, index) => (
                  <div
                    key={index}
                    className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <p className="flex-1 text-gray-700 break-words text-sm">
                        {content}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopyItem(content)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                          title="复制"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(index)}
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}