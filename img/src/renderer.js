//@ts-check
const path = require("path");
const puppeteer = require("puppeteer");

class Renderer {
  constructor(browser) {
    this.browser = browser;
  }

  async quote({ quote, name }) {
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1000, height: 1000 });

    await page.goto(`file://${path.join(__dirname, "../template/index.html")}`);
    await page.evaluate(
      ({ quote, name }) => {
        /* eslint-disable no-undef */
        const quoteBody = document.querySelector("#quote-body");
        const quoteBodyOuter = document.querySelector("#quote-body-outer");
        const quoteName = document.querySelector("#quote-name");
        /* eslint-enable no-undef */

        quoteBody.innerHTML = `&lsquo;${quote}&rsquo;`;
        quoteName.innerHTML = name;
      },
      { quote, name }
    );

    return await page.screenshot({ fullPage: true });
  }
}

async function create() {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"]
  });
  return new Renderer(browser);
}

module.exports = create;
