import React from "react";
import styled from "styled-components";
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

const Spacer = styled.div`
  height: ${props => props.height || 1}rem;
`;

export default class QuoteSubmissionForm extends React.Component {
  state = { quote: "", name: "", email: "", country: "" };

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  render() {
    const textareaPlaceholder = IS_DEVICE_TOUCHSCREEN
      ? "Type your answer below"
      : "Type here";
    return (
      <form onSubmit={this.handleFormSubmit}>
        <QuotePreviewWrapper
          name={this.state.name}
          quote={this.state.quote}
          handleQuoteChange={this.handleInputChange}
          placeholder={textareaPlaceholder}
          styleName={getFontSizeClassName(this.state.quote)}
        />

        <Spacer />

        {IS_DEVICE_TOUCHSCREEN ? (
          <FormField>
            <label htmlFor="form-quote">What matters to you?</label>
            <textarea
              required
              name="quote"
              id="form-quote"
              value={this.state.quote}
              onChange={this.handleInputChange}
              placeholder="Enter your answer"
            />
            <Spacer />
          </FormField>
        ) : null}

        <FormField>
          <label htmlFor="form-name">Name: </label>
          <input
            required
            autoComplete="name"
            name="name"
            id="form-name"
            placeholder="Enter your name"
            value={this.state.name}
            onChange={this.handleInputChange}
          />
        </FormField>

        <FormField>
          <label htmlFor="form-country">Country: </label>
          <input
            required
            name="country"
            id="form-country"
            autoComplete="address-level1"
            placeholder="Enter your country"
            value={this.state.country}
            onChange={this.handleInputChange}
          />
        </FormField>

        <FormField>
          <label htmlFor="form-email">Email: </label>
          <input
            required
            name="email"
            id="form-email"
            placeholder="Enter your email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </FormField>

        <input type="submit" value="submit your quote" />
      </form>
    );
  }

  handleInputChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  /**
   *
   * @param {React.FormEvent} ev
   */
  handleFormSubmit(ev) {
    ev.preventDefault();
    console.log(this.state);
  }
}

const FormField = styled.div`
  font-size: 1rem;
  margin-bottom: 0.4rem;

  label {
    font-size: 0.8rem;
    margin-left: 0.1rem;
  }

  input,
  textarea {
    font-size: inherit;
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    border: none;

    background-color: rgb(248, 248, 248);
  }

  textarea {
    margin-top: 1rem;
    display: block;
    width: 100%;
  }
`;
