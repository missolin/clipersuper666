const API_URL = 'https://api.cognitive.microsofttranslator.com/translate';
const API_KEY = import.meta.env.VITE_TRANSLATOR_API_KEY;
const API_REGION = import.meta.env.VITE_TRANSLATOR_REGION;

export async function translateText(text: string): Promise<string> {
  try {
    // 如果没有API密钥，使用模拟翻译
    if (!API_KEY || !API_REGION) {
      return mockTranslate(text);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Ocp-Apim-Subscription-Region': API_REGION,
      },
      body: JSON.stringify([{
        text,
        to: 'en'
      }])
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data[0]?.translations[0]?.text || text;
  } catch (error) {
    console.error('Translation error:', error);
    return mockTranslate(text);
  }
}

// 模拟翻译功能（仅作演示）
function mockTranslate(text: string): string {
  const commonTranslations: Record<string, string> = {
    '用户名': 'Username',
    '密码': 'Password',
    '登录': 'Login',
    '注册': 'Register',
    '退出': 'Logout',
    '复制': 'Copy',
    '删除': 'Delete',
    '添加': 'Add',
    '粘贴': 'Paste',
    '文件夹': 'Folder',
    '剪贴板': 'Clipboard',
    '内容': 'Content'
  };

  return text.split('').map(char => commonTranslations[char] || char).join('');
}