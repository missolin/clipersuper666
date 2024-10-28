import React, { useState } from 'react';
import { FolderOpen, Clipboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserFolderProps {
  onAddContent: (content: string) => void;
  showNotification: (message: string) => void;
}

export function UserFolder({ onAddContent, showNotification }: UserFolderProps) {
  const { user } = useAuth();
  const [pasteContent, setPasteContent] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        showNotification('剪贴板内容为空');
        return;
      }
      onAddContent(text);
      setPasteContent('');
      showNotification('已添加剪贴板内容');
    } catch (err) {
      showNotification('读取剪贴板失败');
    }
  };

  const handleTextAreaPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    setPasteContent(text);
  };

  const handleSubmitPaste = () => {
    if (!pasteContent.trim()) {
      showNotification('请先输入或粘贴内容');
      return;
    }
    onAddContent(pasteContent);
    setPasteContent('');
    showNotification('内容已添加到剪贴板');
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <FolderOpen className="w-6 h-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          {user?.username} 的文件夹
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <textarea
          value={pasteContent}
          onChange={(e) => setPasteContent(e.target.value)}
          onPaste={handleTextAreaPaste}
          placeholder="在此粘贴或输入文本..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handlePaste}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <Clipboard className="w-5 h-5" />
            读取剪贴板
          </button>
          <button
            onClick={handleSubmitPaste}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            添加内容
          </button>
        </div>
      </div>
    </div>
  );
}