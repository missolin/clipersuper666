export interface ClipboardItem {
  id: string;
  content: string;
  createdAt: Date;
}

export interface ContentGroup {
  id: string;
  name: string;
  items: ClipboardItem[];
  createdAt: Date;
}

export interface User {
  username: string;
  passwordHash: string;
}

export type Language = 'en' | 'zh';