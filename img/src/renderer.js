//@ts-check
const path = require("path");
const puppeteer = require("puppeteer");

class Renderer {
  constructor(browser) {
    this.browser = browser;
  }

  async initPage() {
    try {
      this.page = await this.browser.newPage();
      this.page.setViewport({ width: 1000, height: 1000 });
    } catch (e) {
      throw e;
    }
  }

  async quote({ quote, name }) {
    await this.page.goto(
      `file://${path.join(__dirname, "../template/index.html")}`
    );
    await this.page.evaluate(
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

    return await this.page.screenshot({ fullPage: true });
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
