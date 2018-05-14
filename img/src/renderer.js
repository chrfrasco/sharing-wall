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
      this.page.setViewport({ width: 1920, height: 1432 });
      this.page.on("error", this.handlePageError);
    } catch (e) {
      throw e;
    }
  }

  async quote({ quote, name, backgroundVersion = 1 }) {
    await this.page.goto(
      `file://${path.join(__dirname, "../template/index.html")}`
    );

    const className = getFontSizeClassName(quote);
    await this.page.evaluate(
      ({ quote, name, className, backgroundVersion }) => {
        /* eslint-disable no-undef */
        const quoteBody = document.querySelector("#quote-body");
        const quoteName = document.querySelector("#quote-name");
        /** @type {HTMLImageElement} */
        const quoteBackground = document.querySelector("#quote-background");
        /* eslint-enable no-undef */

        quoteBody.innerHTML = `&lsquo;${quote}&rsquo;`;
        quoteBody.classList.add(className);
        quoteName.innerHTML = name;
        quoteBackground.src = `backgrounds/engagement-tile-${backgroundVersion}.jpg`;
      },
      { quote, name, className, backgroundVersion }
    );

    await (() => new Promise(resolve => setTimeout(resolve, 100)))();
    return await this.page.screenshot({ fullPage: true });
  }

  handlePageError(e) {
    console.error(e);
  }
}

async function create() {
  const launchArgs =
    process.env.NODE_ENV === "production"
      ? {
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }
      : {
          executablePath: "/usr/bin/google-chrome",
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        };
  const browser = await puppeteer.launch(launchArgs);
  return new Renderer(browser);
}

module.exports = create;
