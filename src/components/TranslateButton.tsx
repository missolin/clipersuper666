import React from 'react';
import { Languages } from 'lucide-react';

interface TranslateButtonProps {
  text: string;
  onTranslate: (text: string) => Promise<void>;
}

export function TranslateButton({ text, onTranslate }: TranslateButtonProps) {
  return (
    <button
      onClick={() => onTranslate(text)}
      className="p-2 text-gray-600 hover:text-green-600 rounded-lg hover:bg-gray-100"
      title="翻译为英语"
    >
      <Languages className="w-5 h-5" />
    </button>
  );
}