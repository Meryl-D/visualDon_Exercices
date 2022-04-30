import puppeteer from "puppeteer";

/* Partie 1 - Screenshot Wikipedia */

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {width: 1920, height: 1720}
    });
    const page = await browser.newPage();
    await page.goto('https://fr.wikipedia.org/wiki/Canton_(Suisse)#Données_cantonales');
    await page.screenshot({ path: 'img/wiki.png' });
  
    await browser.close();
  })();