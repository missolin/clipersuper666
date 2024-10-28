import React, { useState } from 'react';
import { Clipboard, Plus } from 'lucide-react';

interface MainInputProps {
  onAddContent: (content: string) => void;
  showNotification: (message: string) => void;
}

export function MainInput({ onAddContent, showNotification }: MainInputProps) {
  const [value, setValue] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(text);
    } catch (err) {
      showNotification('无法读取剪贴板内容');
    }
  };

  const handleAdd = () => {
    if (!value.trim()) {
      showNotification('请先输入或粘贴内容');
      return;
    }
    onAddContent(value);
    setValue('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="在此输入或粘贴内容，每行将被分开显示..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] resize-none"
      />
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handlePaste}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <Clipboard className="w-5 h-5" />
          读取剪贴板
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          添加到临时列表
        </button>
      </div>
    </div>
  );
}