import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36");
  await page.goto("https://www.dyson.com/sticks/dyson-v11-shop-all.html");

  const items = new Map(await page.evaluate(() => {
    const itemElements = document.querySelectorAll(".trade-up-item");
    const result: [string, number][] = [];

    itemElements.forEach(item => {
      const itemName = item.querySelector(".trade-up-item__name")!.textContent || "";
      const price = +(item.querySelector(".trade-up-item__price")!.attributes.getNamedItem("data-product-price-unformatted")!.value);

      result.push([itemName, price]);
    })

    return result;
  }));

  console.log(items);

  await browser.close();
})();