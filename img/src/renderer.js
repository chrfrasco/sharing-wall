//@ts-check
const path = require("path");
const puppeteer = require("puppeteer");

const fontSizeClassNames = {
  sml: "quote-font--sml",
  med: "quote-font--med",
  lge: "quote-font--lge"
};

/**
 * Get the font size class name for the
 * current quote string length.
 *
 * @param {string} quote
 * @returns {string}
 */
function getFontSizeClassName(quote) {
  const charCount = quote.length;
  if (charCount < 65) {
    return fontSizeClassNames.lge;
  } else if (charCount < 100) {
    return fontSizeClassNames.med;
  } else {
    return fontSizeClassNames.sml;
  }
}

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

    const className = getFontSizeClassName(quote);
    await this.page.evaluate(
      ({ quote, name, className }) => {
        /* eslint-disable no-undef */
        const quoteBody = document.querySelector("#quote-body");
        const quoteName = document.querySelector("#quote-name");
        /* eslint-enable no-undef */

        quoteBody.innerHTML = `&lsquo;${quote}&rsquo;`;
        quoteBody.classList.add(className);
        quoteName.innerHTML = name;
      },
      { quote, name, className }
    );

    return await this.page.screenshot({ fullPage: true });
  }
}

async function create() {
  const launchArgs = {
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  };
  const browser = await puppeteer.launch(launchArgs);
  return new Renderer(browser);
}

module.exports = create;
