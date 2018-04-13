import React from "react";
import { Redirect } from "react-router";
import QuotePreviewWrapper from "./QuotePreviewWrapper";
import { FormField, Spacer } from "../elements";
import { IS_DEVICE_TOUCHSCREEN, IS_PRODUCTION } from "../../constants";
import api, { states } from "../../api";

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

function getQuoteFromState({ quote, name, email, country }) {
  return {
    body: quote,
    name,
    email,
    country
  };
}

const initialState = IS_PRODUCTION
  ? {
      loadingState: states.NOT_STARTED,
      quote: "",
      name: "",
      email: "",
      country: ""
    }
  : {
      loadingState: states.NOT_STARTED,
      quote: "Treating others as I would have them treat me.",
      name: "Christian Scott",
      email: "christianfscott@gmail.com",
      country: "New Zealand"
    };

export default class QuoteSubmissionForm extends React.Component {
  state = initialState;

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  render() {
    switch (this.state.loadingState) {
      case states.LOADED:
        return <Redirect to={`/quote/${this.state.quoteID}`} />;
      case states.NOT_STARTED:
        return this.renderForm();
      case states.LOADING:
        return <h1>Submitting...</h1>;
      case states.ERROR:
        return <Redirect to="/error" />;
      default:
        throw new Error(
          `loadingState ${this.state.loadingState.toString()} not handled`
        );
    }
  }

  renderForm() {
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
            type="email"
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
   * @param {React.FormEvent} ev
   */
  async handleFormSubmit(ev) {
    ev.preventDefault();

    this.setState({ loadingState: states.LOADING });

    try {
      const quote = getQuoteFromState(this.state);
      const updatedQuote = await api.postQuote(quote);
      this.setState({ loadingState: states.LOADED, ...updatedQuote });
    } catch (e) {
      this.setState({ loadingState: states.ERROR });
    }
  }
}
