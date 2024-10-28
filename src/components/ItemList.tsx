import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { ClipboardItem } from '../types';
import { TranslateButton } from './TranslateButton';
import { translateText } from '../utils/translator';

interface ItemListProps {
  items: ClipboardItem[];
  onCopy: (content: string) => void;
  onDelete: (id: string) => void;
  showNotification: (message: string) => void;
}

export function ItemList({ items, onCopy, onDelete, showNotification }: ItemListProps) {
  const handleTranslate = async (text: string) => {
    try {
      const translated = await translateText(text);
      await navigator.clipboard.writeText(translated);
      showNotification('已翻译并复制到剪贴板');
    } catch (err) {
      showNotification('翻译失败');
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex-1 break-all text-gray-700">
            {item.content}
          </div>
          <div className="flex gap-2">
            <TranslateButton 
              text={item.content}
              onTranslate={handleTranslate}
            />
            <button
              onClick={() => onCopy(item.content)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
              title="复制"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
              title="删除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}