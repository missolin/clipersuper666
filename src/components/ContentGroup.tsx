import React from 'react';
import { Copy, Trash2, FolderOpen } from 'lucide-react';
import { ContentGroup as IContentGroup, ClipboardItem } from '../types';

interface ContentGroupProps {
  group: IContentGroup;
  selectedItems: Set<string>;
  onToggleSelect: (id: string) => void;
  onCopyItem: (content: string) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onCopyGroup: (items: ClipboardItem[]) => void;
  showNotification: (message: string) => void;
}

export function ContentGroup({
  group,
  selectedItems,
  onToggleSelect,
  onCopyItem,
  onRemoveItem,
  onRemoveGroup,
  onCopyGroup,
  showNotification,
}: ContentGroupProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              {group.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600">{group.items.length} 个条目</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onCopyGroup(group.items)}
            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            复制全部
          </button>
          <button
            onClick={() => onRemoveGroup(group.id)}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            删除分组
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {group.items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${
              selectedItems.has(item.id)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            } transition-colors duration-200`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm">
                  {item.content}
                </pre>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => onCopyItem(item.content)}
                  className="p-1.5 text-gray-600 hover:text-indigo-600 rounded"
                  title="复制"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onToggleSelect(item.id)}
                  className="p-1.5 text-gray-600 hover:text-indigo-600 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </button>
                <button
                  onClick={() => onRemoveItem(group.id, item.id)}
                  className="p-1.5 text-gray-600 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}