const puppeteer = require("puppeteer");
const fs = require("fs");

const get_telegram_channel = async (total_url) => {
    let telegrams = [];
    let telegram_urls = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for(let i = 0; i < total_url.length; i ++)
    {
        console.log(i + " " + total_url[i]);
        await page.goto(total_url[i], {timeout: `100000000`});
        const telegram_channel = await page.evaluate(()=>{
            let res = "";
            let links = document.getElementsByClassName('sc-f70bb44c-0 sc-c3d90b62-0 fSMMKk');
            for(let j = 0; j < links.length; j ++){

                let temp = links[j].firstChild?.href; 
                if(temp != undefined && temp.includes('https://t.me/')){
                    res = links[j].firstChild.href;
                }
            }
            return res;
        })
        if(telegram_channel != ""){
            telegram_urls.push(telegram_channel);
            const pattern = /t\.me\/(.+)/;
            const match = telegram_channel.match(pattern);
            if(match && match[1]) {
                telegrams.push(match[1]);
            }
            
        }
    }

    fs.writeFile('telegram_urls.txt', telegram_urls.join('\n'), 'utf8', (err) => {
        if(err) {
            console.error('Error Writing File:', err);
        }
        else {
            console.log("saved sucessfully.");
        }
    })

    fs.writeFile('telegrams.txt', telegrams.join('\n'), 'utf8', (err) => {
        if(err) {
            console.error('Error Writing File:', err);
        }
        else {
            console.log("saved sucessfully.");
        }
    })
    await browser.close();
}
(async () => {
  

  let total_url = [];
  fs.readFile('urls.txt', 'utf8', (err, data) => {
    if(err){
        console.error('Error reading file:', err);
    } else {
        total_url = data.split('\n');
        get_telegram_channel(total_url);
    }
  })

})();

//funnção autoexecutável, mais rápida do que fazer uma função e rodar dps
