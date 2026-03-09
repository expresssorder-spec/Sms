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
    name: 'Server 1',
    baseUrl: 'https://receive-smss.com',
    numbersList: { url: 'https://receive-smss.com/' },
  },
  'anonymsms': {
    id: 'anonymsms',
    name: 'Server 2',
    baseUrl: 'https://anonymsms.com',
    numbersList: { url: 'https://anonymsms.com/' },
  },
  'sms-receive': {
    id: 'sms-receive',
    name: 'Server 3',
    baseUrl: 'https://sms-receive.net',
    numbersList: { url: 'https://sms-receive.net/' },
  }
};
