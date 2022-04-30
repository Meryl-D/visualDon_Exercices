import puppeteer from "puppeteer";

/* Partie 3 - Webscraper e-commerce */
(async () => {
    const url = 'https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops';
    const browser = await puppeteer.launch();
  
    try {
        const page = await browser.newPage();
        await page.goto(url);

        let productList = [];

        let div = await page.$$('div.thumbnail')

        for (let el of div) {
            let product = await el.$eval('.title', el => el.textContent);
            let price = await el.$eval('.price', el => el.textContent);
            let stars = await el.$eval('.ratings :nth-child(2)', el => el.getAttribute( 'data-rating' ));
            stars = parseInt(stars);
            
            let productComplete = {
                produit: product,
                prix: price,
                etoiles: stars
            }

            productList.push(productComplete);
        }

        console.table(productList);
        
    } catch (error) {
      console.log('error', error);
    }
})();