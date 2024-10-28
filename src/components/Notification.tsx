import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
}

export function Notification({ message }: NotificationProps) {
  if (!message) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
      <AlertCircle className="w-5 h-5" />
      {message}
    </div>
  );
}