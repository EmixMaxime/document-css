const puppeteer = require('puppeteer');

(async () => {
  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  // NOTE Generating a pdf is currently only supported in Chrome headless.
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.emulateMedia('screen');
  await page.goto('http://localhost:3000');
  await page.pdf({path: 'hn.pdf', format: 'A4', displayHeaderFooter: true, printBackground: true});

  await browser.close();
})();
