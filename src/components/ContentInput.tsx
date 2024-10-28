import React from 'react';
import { Copy, Split, Plus } from 'lucide-react';

interface ContentInputProps {
  newContent: string;
  onContentChange: (content: string) => void;
  onPaste: () => void;
  onSplit: () => void;
  onAddSingle: () => void;
}

export function ContentInput({ 
  newContent, 
  onContentChange, 
  onPaste, 
  onSplit, 
  onAddSingle 
}: ContentInputProps) {
  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault(); // 阻止默认粘贴行为
    const text = e.clipboardData.getData('text');
    onContentChange(text); // 更新输入框内容
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
      <div className="flex gap-2 mb-4">
        <textarea
          value={newContent}
          onChange={(e) => onContentChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="在此输入或粘贴多行内容..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none min-h-[120px]"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onPaste}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          从剪贴板读取
        </button>
        <button
          onClick={onSplit}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2"
        >
          <Split className="w-4 h-4" />
          分组添加
        </button>
        <button
          onClick={onAddSingle}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加为单个条目
        </button>
      </div>
    </div>
  );
}