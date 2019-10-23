import puppeteer from "puppeteer";

process.addListener("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36");
  await page.goto("https://www.dyson.com/sticks/dyson-v11-shop-all.html");

  const items = new Map(await page.evaluate(() => {
    const itemElements = document.querySelectorAll(".trade-up-item");
    const result: [string, number][] = [];

    itemElements.forEach(item => {
      const nameNode = item.querySelector(".trade-up-item__name");
      const priceNode = item.querySelector(".trade-up-item__price");

      if (nameNode && priceNode) {
        const priceAttribute = priceNode.attributes.getNamedItem("data-product-price-unformatted");

        if (priceAttribute) {
          const itemName = nameNode.textContent || "";
          const price = + priceAttribute.value;

          result.push([itemName, price]);
        }
      }
    })

    return result;
  }));

  console.log(items);

  await browser.close();
})();