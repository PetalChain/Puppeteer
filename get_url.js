const puppeteer = require("puppeteer");
const fs = require("fs");
const { url } = require("inspector");

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

(async () => {
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try{
    await page.goto('https://coinmarketcap.com');
  } catch(error) {
    console.error('Navigation Failed:', error);
  }
  let total_url = [];
  for(let i = 2; i <= 89 ; i ++)
  {
    let url_on_page = [];
    await autoScroll(page);

    await page.waitForSelector(".sc-aef7b723-0.LCOyB");
    const elements = await page.$$(".sc-aef7b723-0.LCOyB");
    for (const element of elements) {
      const linkElement = await element.$('a');
      const link = await linkElement.evaluate(node => node.href);
      url_on_page.push(link);
    }

    total_url = total_url.concat(url_on_page);
    console.log(i);
    await page.goto("https://coinmarketcap.com/?page=" + i, {timeout: `100000000`});
  }
  fs.writeFile('urls.txt', total_url.join('\n'), 'utf8', (err)=>{
    if(err){
      console.error('Error writing to file:', err);
    } else {
      console.log('Array written to file succesfully.');
    }
  })
 
  await browser.close();
})();

//funnção autoexecutável, mais rápida do que fazer uma função e rodar dps
