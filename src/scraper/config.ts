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
  'anonymsms': {
    id: 'anonymsms',
    name: 'Secondary Node',
    baseUrl: 'https://anonymsms.com',
    numbersList: { url: 'https://anonymsms.com/' },
  },
  'sms-receive': {
    id: 'sms-receive',
    name: 'Backup Node',
    baseUrl: 'https://sms-receive.net',
    numbersList: { url: 'https://sms-receive.net/' },
  },
  'sms24': {
    id: 'sms24',
    name: 'Global Node',
    baseUrl: 'https://sms24.me',
    numbersList: { url: 'https://sms24.me/en/numbers' },
  },
  'sms-online': {
    id: 'sms-online',
    name: 'Privacy Node',
    baseUrl: 'https://sms-online.co',
    numbersList: { url: 'https://sms-online.co/receive-free-sms' },
  },
  'receive-sms-free': {
    id: 'receive-sms-free',
    name: 'CC Node',
    baseUrl: 'https://receive-sms-free.cc',
    numbersList: { url: 'https://receive-sms-free.cc/' },
  },
  'sms-activation': {
    id: 'sms-activation',
    name: 'Active Node',
    baseUrl: 'https://sms-activation-service.com',
    numbersList: { url: 'https://sms-activation-service.com/' },
  }
};
