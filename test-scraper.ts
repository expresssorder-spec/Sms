import { getMessages } from './src/scraper/index';
import { configs } from './src/scraper/config';

async function test() {
  try {
    const messages = await getMessages('https://receive-smss.com/sms/447403504888/', configs['receive-smss']);
    console.log(`Found ${messages.length} messages`);
    console.log(messages.slice(0, 5));
  } catch (e) {
    console.error(e);
  }
}

test().catch(console.error);
