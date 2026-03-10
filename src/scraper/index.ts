import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ScraperConfig } from './config.js';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export async function getNumbers(config: ScraperConfig) {
  try {
    const response = await axios.get(config.numbersList.url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const numbers: any[] = [];

    // Site-specific selectors for better accuracy
    let links: cheerio.Cheerio<any>;
    if (config.id === 'receive-smss') {
        links = $('a[href*="/sms/"], a[href*="receive-sms-from"]');
    } else if (config.id === 'sms-online') {
        links = $('a[href*="/receive-free-sms/"]');
    } else if (config.id === 'receive-sms-free') {
        links = $('a[href*="/Free-SMS-Numbers/"]');
    } else if (config.id === 'spytm') {
        links = $('a[href*="/receive-sms-online/"], a[href*="/number/"]');
    } else {
        links = $('a');
    }

    // If site-specific selectors found nothing, fallback to all links
    if (links.length === 0) links = $('a');

    links.each((_, el) => {
      let link = $(el).attr('href');
      if (!link) return;
      
      // Filter out obvious non-number links
      if (link.includes('privacy') || link.includes('contact') || link.includes('about') || link.includes('login') || link.includes('register') || link.includes('faq')) {
        return;
      }

      const text = $(el).text().trim();
      
      // Try to find a phone number pattern in the text or link
      const phoneMatch = text.match(/\+?\d{8,15}/) || link.match(/\+?\d{8,15}/);
      if (!phoneMatch) return;

      let numberText = phoneMatch[0];
      if (!numberText.startsWith('+')) {
          // Try to prepend '+' if it's missing, but only if it looks like a full number
          if (numberText.length >= 10) numberText = '+' + numberText;
      }

      // Guess country from text or default to Unknown
      let countryText = 'Unknown';
      
      // Try to parse the phone number to get the country code
      try {
        const phoneNumber = parsePhoneNumberFromString(numberText);
        if (phoneNumber && phoneNumber.country) {
          const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
          countryText = regionNames.of(phoneNumber.country) || 'Unknown';
        }
      } catch (e) {
        // Ignore parsing errors
      }

      // Fallback to text matching if parsing failed
      if (countryText === 'Unknown') {
        const knownCountries = ['United States', 'USA', 'United Kingdom', 'UK', 'Canada', 'France', 'Germany', 'Netherlands', 'Spain', 'Sweden', 'Finland', 'Denmark', 'Poland', 'Russia', 'Australia', 'Belgium', 'Austria', 'Switzerland', 'Portugal', 'Romania', 'Croatia', 'Estonia', 'Latvia', 'Lithuania', 'Czech Republic', 'Slovakia', 'Hungary', 'Bulgaria', 'Greece', 'Ireland', 'Norway', 'Japan', 'South Korea', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Egypt', 'Israel', 'Turkey', 'Saudi Arabia', 'United Arab Emirates', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Vietnam', 'Philippines', 'New Zealand', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ukraine', 'Kazakhstan', 'Georgia', 'Armenia', 'Moldova', 'Azerbaijan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Belarus', 'Lithuania', 'Latvia', 'Estonia'];
        
        for (const c of knownCountries) {
          if (text.toLowerCase().includes(c.toLowerCase()) || link.toLowerCase().includes(c.toLowerCase())) {
            countryText = c;
            break;
          }
        }
      }

      // Ensure link is absolute
      if (link.startsWith('/')) {
          link = config.baseUrl + link;
      } else if (!link.startsWith('http')) {
          link = config.baseUrl + '/' + link;
      }

      // Avoid duplicates
      if (!numbers.find(n => n.number === numberText)) {
          numbers.push({
              id: uuidv4(),
              number: numberText,
              country: countryText,
              link: link,
              source: config.name,
              siteId: config.id
          });
      }
    });

    return numbers;
  } catch (error) {
    console.error(`Error scraping numbers from ${config.numbersList.url}:`, error);
    throw new Error(`Failed to scrape numbers: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getMessages(numberUrl: string, config: ScraperConfig) {
  try {
    const response = await axios.get(numberUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': config.baseUrl,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    
    // Remove noise but be careful not to remove content
    $('script, style, noscript, iframe, nav, footer').remove();

    const messages: any[] = [];

    // Site-specific high-priority selectors
    if (config.id === 'sms-online') {
        $('table tr').each((_, el) => {
            const tds = $(el).find('td');
            if (tds.length >= 3) {
                const from = tds.eq(0).text().trim();
                const text = tds.eq(1).text().trim();
                const time = tds.eq(2).text().trim();
                if (from && text) {
                    messages.push({ id: uuidv4(), sender: from, text, time: time || 'Just now' });
                }
            }
        });
        if (messages.length > 0) return messages;
    }

    if (config.id === 'receive-sms-free') {
        $('table tr').each((_, el) => {
            const tds = $(el).find('td');
            if (tds.length >= 3) {
                const from = tds.eq(0).text().trim();
                const text = tds.eq(1).text().trim();
                const time = tds.eq(2).text().trim();
                if (from && text) {
                    messages.push({ id: uuidv4(), sender: from, text, time: time || 'Just now' });
                }
            }
        });
        if (messages.length > 0) return messages;
    }

    if (config.id === 'receive-smss') {
        $('table tr').each((_, el) => {
            const tds = $(el).find('td');
            if (tds.length >= 3) {
                const from = tds.eq(0).text().trim();
                const text = tds.eq(1).text().trim();
                const time = tds.eq(2).text().trim();
                if (from && text) {
                    messages.push({ id: uuidv4(), sender: from, text, time: time || 'Just now' });
                }
            }
        });
        if (messages.length > 0) return messages;
    }

    if (config.id === 'spytm') {
        $('table tr').each((_, el) => {
            const tds = $(el).find('td');
            if (tds.length >= 3) {
                const from = tds.eq(0).text().trim();
                const text = tds.eq(1).text().trim();
                const time = tds.eq(2).text().trim();
                if (from && text) {
                    messages.push({ id: uuidv4(), sender: from, text, time: time || 'Just now' });
                }
            }
        });
        if (messages.length > 0) return messages;
    }

    // Generic Table/Row extraction
    const rowSelectors = [
        'table tbody tr', 
        'table tr', 
        '.messages-list .message-row', 
        '.sms-table tr',
        '.msg-row', 
        '.message_details', 
        '.sms-item', 
        '.sms-row',
        '.table-panel',
        '.sms-card'
    ];

    $(rowSelectors.join(', ')).each((_, el) => {
      const tds = $(el).find('td, th, .cell, .col, .sms-content, .sms-sender, .sms-time, .sender, .from, .time, .text, .message, .msgg, .senderr');
      
      if (tds.length >= 2 || $(el).hasClass('message_details')) { 
        let sender = '';
        let text = '';
        let time = '';

        // Try class-based identification
        tds.each((i, td) => {
          const $td = $(td);
          const content = $td.text().replace(/\s+/g, ' ').trim();
          if (!content) return;

          if ($td.hasClass('message') || $td.hasClass('text') || $td.hasClass('msgg') || $td.hasClass('sms-content') || $td.hasClass('table-panel__message')) {
            text = content;
          } else if ($td.hasClass('sender') || $td.hasClass('from') || $td.hasClass('senderr') || $td.hasClass('sms-sender') || $td.hasClass('table-panel__sender')) {
            sender = content;
          } else if ($td.hasClass('time') || $td.hasClass('date') || $td.hasClass('sms-time') || $td.hasClass('table-panel__time')) {
            time = content;
          }
        });

        // Fallback to position-based if class-based failed
        if (!text || !sender) {
          const texts: string[] = [];
          tds.each((i, td) => {
            const t = $(td).text().replace(/\s+/g, ' ').trim();
            if (t && t.length < 1000 && !t.includes('function') && !t.includes('var ')) {
              texts.push(t);
            }
          });

          if (texts.length >= 2) {
            const sorted = [...texts].sort((a, b) => b.length - a.length);
            text = sorted[0];
            const remaining = texts.filter(t => t !== text);
            sender = remaining[0] || 'Unknown';
            time = remaining[1] || 'Just now';
          }
        }

        if (text && text.length > 1 && text.length < 2000) {
            sender = sender || 'Unknown';
            time = time || 'Recent';
            
            // Clean labels
            sender = sender.replace(/^(Sender|From|Number)\s*:?/i, '').trim();
            text = text.replace(/^(Message|Content|Text)\s*:?/i, '').trim();
            time = time.replace(/^(Time|Date|Received)\s*:?/i, '').trim();

            if (!['sender', 'from', 'message', 'time'].includes(sender.toLowerCase())) {
                const isDuplicate = messages.some(m => m.sender === sender && m.text === text);
                if (!isDuplicate) {
                    messages.push({ id: uuidv4(), sender, text, time });
                }
            }
        }
      }
    });

    // Final catch-all for very loose structures
    if (messages.length === 0) {
        $('.sms-content, .message-body, .msg-text').each((_, el) => {
            const text = $(el).text().trim();
            if (text.length > 2 && text.length < 1000) {
                messages.push({ id: uuidv4(), sender: 'Unknown', text, time: 'Recent' });
            }
        });
    }

    return messages;
  } catch (error) {
    console.error(`Error scraping messages from ${numberUrl}:`, error);
    return [];
  }
}
