export interface ScraperConfig {
  id: string;
  name: string;
  baseUrl: string;
  numbersList: {
    url: string;
  };
}

export const configs: Record<string, ScraperConfig> = {
  'receive-smss': {
    id: 'receive-smss',
    name: 'Primary Node',
    baseUrl: 'https://receive-smss.com',
    numbersList: { url: 'https://receive-smss.com/' },
  },
  'receive-smss-2': {
    id: 'receive-smss',
    name: 'Primary Node (Page 2)',
    baseUrl: 'https://receive-smss.com',
    numbersList: { url: 'https://receive-smss.com/page/2/' },
  },
  'receive-smss-3': {
    id: 'receive-smss',
    name: 'Primary Node (Page 3)',
    baseUrl: 'https://receive-smss.com',
    numbersList: { url: 'https://receive-smss.com/page/3/' },
  },
  'receive-smss-4': {
    id: 'receive-smss',
    name: 'Primary Node (Page 4)',
    baseUrl: 'https://receive-smss.com',
    numbersList: { url: 'https://receive-smss.com/page/4/' },
  },
  'receive-smss-5': {
    id: 'receive-smss',
    name: 'Primary Node (Page 5)',
    baseUrl: 'https://receive-smss.com',
    numbersList: { url: 'https://receive-smss.com/page/5/' },
  },
  'receive-sms-free': {
    id: 'receive-sms-free',
    name: 'CC Node',
    baseUrl: 'https://receive-sms-free.cc',
    numbersList: { url: 'https://receive-sms-free.cc/' },
  },
  'spytm': {
    id: 'spytm',
    name: 'Spy Node',
    baseUrl: 'https://spytm.com',
    numbersList: { url: 'https://spytm.com/' },
  },
  'receive-sms-cc': {
    id: 'receive-sms-cc',
    name: 'Backup Node',
    baseUrl: 'https://receive-sms.cc',
    numbersList: { url: 'https://receive-sms.cc/' },
  }
};
