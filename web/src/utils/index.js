import api from "../api";
import { MAX_QUOTE_LEN } from "../constants";

/**
 * @param {object} quote
 */
export function storeQuote(quote) {
  if (!quote.quoteID) {
    throw new TypeError("property `quoteID` missing on quote");
  }
  localStorage.setItem(quote.quoteID, JSON.stringify(quote));
}

/**
 * @param {string} quoteID
 */
export async function retrieveQuote(quoteID) {
  const quoteStr = localStorage.getItem(quoteID);
  if (quoteStr != null) {
    const quote = JSON.parse(quoteStr);
    return quote;
  }

  const quote = await api.getQuote(quoteID);
  return quote;
}

/**
 * Strip single quotes from a string
 *
 * @param {string} s target string
 * @returns {string}
 */
export function stripQuotationMarks(s) {
  return s.replace(/(‘|’)/g, "");
}

/**
 * Wraps a string in quotation marks, after stripping any
 * other quote marks from the beginning/end of the string.
 *
 * If the string is empty after stripping quotes,
 * returns the empty string.
 *
 * @param {string} s target string
 * @returns {string}
 */
export function wrapInQuotemarks(s) {
  const stripped = stripQuotationMarks(s);
  if (stripped === "") {
    return "";
  }

  return `‘${stripped}’`;
}

/**
 * Tests if the current device is a mobile phone or a tablet.
 *
 * From https://stackoverflow.com/a/11381730/5130898
 *
 * @returns {boolean}
 */
export function isTouchscreenDevice() {
  let check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

/**
 * Simple email validation. Will have some false positives, but correcting this would
 * introduce false negatives which is debatably worse.
 *
 * From https://stackoverflow.com/a/9204568/5130898
 *
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

/**
 * Empty function for use as a default callback
 */
export function noop() {}

/**
 * Restrict the value of a number
 *
 * @param {number} n number to clamp
 * @param {{ max: number, min: number }} opts
 */
export function clamp(n, { min = 0, max = 1 }) {
  return Math.max(min, Math.min(n, max));
}

export function makeFacebookShareURL(quoteID) {
  return `https://www.facebook.com/sharer/sharer.php?u=${makeShareURL(
    quoteID
  )}`;
}

export function makeTwitterShareURL(quoteID) {
  return `https://twitter.com/home?status=What%20matters%20to%20me%20${makeShareURL(
    quoteID
  )}`;
}

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "https://sharing-wall-api.herokuapp.com";
/**
 * Render a URL for the share endpoint
 * @param {string} quoteID
 */
export function makeShareURL(quoteID) {
  return encodeURI(`${BASE_URL}/api/share?quoteID=${quoteID}`);
}

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
export function getFontSizeClassName(quote) {
  const charCount = quote.length;
  if (charCount < 65) {
    return fontSizeClassNames.lge;
  } else if (charCount < 100) {
    return fontSizeClassNames.med;
  } else {
    return fontSizeClassNames.sml;
  }
}

/**
 * Return a random natural number in the range [min, max)
 *
 * @param {number} min floor
 * @param {number} max ceiling
 */
export function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param {any} quote Object to validate
 * @returns {boolean}
 */
export function validateQuote(quote) {
  const validQuoteBody =
    0 < quote.quote.length && quote.quote.length < MAX_QUOTE_LEN;
  const validEmail = validateEmail(quote.email);
  return (
    validQuoteBody &&
    validEmail &&
    quote.name != null &&
    quote.name !== "" &&
    quote.country != null &&
    quote.country !== ""
  );
}
