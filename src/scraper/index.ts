import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { ScraperConfig } from './config.js';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0',
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

    // Generic extraction: look for links that might be SMS numbers
    $('a').each((_, el) => {
      let link = $(el).attr('href');
      if (!link) return;
      
      // Filter out obvious non-number links
      if (link.includes('privacy') || link.includes('contact') || link.includes('about') || link.includes('login') || link.includes('register') || link.includes('faq') || link.includes('receive-sms-from')) {
        return;
      }

      const text = $(el).text().trim();
      
      // Try to find a phone number pattern in the text or link
      const phoneMatch = text.match(/\+?\d{8,15}/) || link.match(/\+?\d{8,15}/);
      if (!phoneMatch) return;

      let numberText = phoneMatch[0];
      if (!numberText.startsWith('+')) numberText = '+' + numberText;

      // Guess country from text or default to Unknown
      let countryText = 'Unknown';
      const knownCountries = ['United States', 'USA', 'United Kingdom', 'UK', 'Canada', 'France', 'Germany', 'Netherlands', 'Spain', 'Sweden', 'Finland', 'Denmark', 'Poland', 'Russia', 'Australia', 'Belgium', 'Austria', 'Switzerland', 'Portugal', 'Romania', 'Croatia', 'Estonia', 'Latvia', 'Lithuania', 'Czech Republic', 'Slovakia', 'Hungary', 'Bulgaria', 'Greece', 'Ireland', 'Norway', 'Japan', 'South Korea', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Egypt', 'Israel', 'Turkey', 'Saudi Arabia', 'United Arab Emirates', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Vietnam', 'Philippines', 'New Zealand', 'Chile', 'Colombia', 'Peru', 'Venezuela'];
      
      for (const c of knownCountries) {
        if (text.toLowerCase().includes(c.toLowerCase()) || link.toLowerCase().includes(c.toLowerCase())) {
          countryText = c;
          break;
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
    const messages: any[] = [];

    // Specifically target the <table> or <div> list that contains the SMS history
    // Loop through every single row available in the HTML
    const rows = $('table tbody tr, table tr, .messages-list .message-row, .sms-table .row, .msg-row, .c-list .row, .list-group-item, .row, .message_details');

    rows.each((_, el) => {
      // Find columns within the row
      const tds = $(el).find('td, div.cell, div.col, div[class*="col-"]');
      
      if (tds.length >= 3) {
        // Extract text from all columns
        const texts: string[] = [];
        tds.each((i, td) => {
          // Remove labels like "Message", "Sender", "Time" if they are part of the text
          let t = $(td).text().replace(/\s+/g, ' ').trim();
          t = t.replace(/^(Message|Sender|Time|From|Date)\s*:?/i, '').trim();
          if (t) texts.push(t);
        });

        if (texts.length >= 3) {
          let sender = texts[0];
          let time = texts[1];
          let text = texts[2];

          // Sometimes the order is Sender, Message, Time. 
          // Usually the message is the longest string.
          if (texts[1].length > texts[2].length && !texts[1].toLowerCase().includes('ago') && !texts[1].toLowerCase().includes('min') && !texts[1].toLowerCase().includes('sec')) {
             text = texts[1];
             time = texts[2];
          }

          // If the first column was actually the message (like on receive-smss.com)
          // texts[0] = message, texts[1] = sender, texts[2] = time
          if (texts[0].length > texts[1].length && texts[0].length > texts[2].length && (texts[2].toLowerCase().includes('ago') || texts[2].toLowerCase().includes('min') || texts[2].toLowerCase().includes('sec') || texts[2].toLowerCase().includes('hour') || texts[2].toLowerCase().includes('day'))) {
             text = texts[0];
             sender = texts[1];
             time = texts[2];
          }

          // Skip header rows (if the row is literally just the table headers)
          if (sender.toLowerCase() === 'sender' || sender.toLowerCase() === 'from' || time.toLowerCase() === 'time' || time.toLowerCase() === 'date') {
            return;
          }

          // Validation: SMS messages are rarely over 1000 chars, senders are short, and time should look like a time
          if (text.length > 1000 || sender.length > 100 || time.length > 100) {
            return;
          }

          // Avoid duplicates (sometimes same row is parsed multiple times due to nested selectors)
          const isDuplicate = messages.some(m => m.sender === sender && m.time === time && m.text === text);
          
          if (!isDuplicate && sender && text && time) {
            messages.push({
              sender,
              time,
              text,
            });
          }
        }
      }
    });

    // Fallback for div-based layouts if table extraction fails
    if (messages.length === 0) {
        $('.message-row, .msg-row, .sms-row, .list-item, .message-item, .message_details').each((_, el) => {
            let sender = $(el).find('.sender, .from, .number, .senderr, [class*="sender"], [class*="from"]').text().replace(/\s+/g, ' ').trim();
            let time = $(el).find('.time, .date, .timestamp, [class*="time"], [class*="date"]').text().replace(/\s+/g, ' ').trim();
            let text = $(el).find('.text, .message, .msg, .content, .msgg, [class*="message"], [class*="text"]').text().replace(/\s+/g, ' ').trim();

            sender = sender.replace(/^(Message|Sender|Time|From|Date)\s*:?/i, '').trim();
            time = time.replace(/^(Message|Sender|Time|From|Date)\s*:?/i, '').trim();
            text = text.replace(/^(Message|Sender|Time|From|Date)\s*:?/i, '').trim();

            if (text.length > 1000 || sender.length > 100 || time.length > 100) {
              return;
            }

            if (sender && text && time) {
                const isDuplicate = messages.some(m => m.sender === sender && m.time === time && m.text === text);
                if (!isDuplicate) {
                  messages.push({ sender, time, text });
                }
            }
        });
    }

    return messages;
  } catch (error) {
    console.error(`Error scraping messages from ${numberUrl}:`, error);
    throw new Error(`Failed to scrape messages: ${error instanceof Error ? error.message : String(error)}`);
  }
}
