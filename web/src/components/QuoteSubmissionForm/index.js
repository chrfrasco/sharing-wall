import React from "react";
import QuotePreviewWrapper from "./QuotePreviewWrapper";
import { IS_DEVICE_TOUCHSCREEN } from "../../constants";

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

export default class QuoteSubmissionForm extends React.Component {
  state = { quote: "", name: "" };

  constructor(props) {
    super(props);
    this.handleQuoteChange = this.handleQuoteChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  render() {
    const textareaPlaceholder = IS_DEVICE_TOUCHSCREEN
      ? "Type your answer below"
      : "Type here";
    return (
      <form onSubmit={e => e.preventDefault()}>
        <QuotePreviewWrapper
          name={this.state.name}
          quote={this.state.quote}
          handleQuoteChange={this.handleQuoteChange}
          placeholder={textareaPlaceholder}
          styleName={getFontSizeClassName(this.state.quote)}
        />

        {IS_DEVICE_TOUCHSCREEN ? (
          <textarea
            value={this.state.quote}
            onChange={this.handleQuoteChange}
            placeholder="What matters to you?"
          />
        ) : null}

        <input
          placeholder="Enter your name"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
      </form>
    );
  }

  handleQuoteChange(ev) {
    this.setState({ quote: ev.target.value });
  }

  handleNameChange(ev) {
    this.setState({ name: ev.target.value });
  }
}
