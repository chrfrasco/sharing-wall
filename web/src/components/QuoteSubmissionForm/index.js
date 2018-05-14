import React from "react";
import { Redirect } from "react-router";
import QuotePreviewWrapper from "./QuotePreviewWrapper";
import {
  FlexContainer,
  FormField,
  Spacer,
  SubmitButton,
  LoadingSubmitButton
} from "../elements";
import { IS_DEVICE_TOUCHSCREEN, IS_PRODUCTION } from "../../constants";
import api, { states } from "../../api";
import { validateEmail } from "../../utils";

const MAX_QUOTE_LEN = 400;

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

function getQuoteFromState({ quote, name, email, country, backgroundVersion }) {
  return {
    body: quote,
    backgroundVersion,
    name,
    email,
    country
  };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const initialState = IS_PRODUCTION
  ? {
      loadingState: states.NOT_STARTED,
      quote: "",
      name: "",
      email: "",
      country: "",
      backgroundVersion: rand(1, 4)
    }
  : {
      loadingState: states.NOT_STARTED,
      quote: "Treating others as I would have them treat me.",
      name: "Christian Scott",
      email: "christianfscott@gmail.com",
      country: "New Zealand",
      backgroundVersion: rand(1, 4)
    };

export default class QuoteSubmissionForm extends React.Component {
  state = initialState;
  bgVersion = rand(1, 4);

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
        return this.renderForm(false);
      case states.LOADING:
        return this.renderForm(true);
      case states.ERROR:
        return <Redirect to="/error" />;
      default:
        throw new Error(
          `loadingState ${this.state.loadingState.toString()} not handled`
        );
    }
  }

  renderForm(loading) {
    const textareaPlaceholder = IS_DEVICE_TOUCHSCREEN
      ? "Type your answer below"
      : "Type here";
    const textAreaClassName = [
      "quote__body",
      "row",
      getFontSizeClassName(this.state.quote)
    ].join(" ");

    return (
      <form onSubmit={this.handleFormSubmit}>
        <QuotePreviewWrapper
          bgVersion={this.state.backgroundVersion}
          name={this.state.name}
        >
          <textarea
            name="quote"
            className={textAreaClassName}
            ref={this.textArea}
            value={this.state.quote}
            onChange={this.handleInputChange}
            placeholder={textareaPlaceholder}
            readOnly={IS_DEVICE_TOUCHSCREEN}
            disabled={loading || IS_DEVICE_TOUCHSCREEN}
            maxLength={280}
          />
        </QuotePreviewWrapper>

        <Spacer height={2} />

        <FlexContainer>
          <section>
            <p>
              <b style={{ fontWeight: 500 }}>Tell us what matters to you.</b>{" "}
              We'll post your answer and you'll also go into the draw to win
              flights and accomodation to attend the launch event for the 200
              Women exhibition in Munich on October 27*.
            </p>
            <small>*Terms and conditions apply</small>
            <Spacer height={2} />
          </section>

          {IS_DEVICE_TOUCHSCREEN ? (
            <FormField>
              <label htmlFor="form-quote">What matters to you?</label>
              <textarea
                required
                disabled={loading}
                name="quote"
                id="form-quote"
                value={this.state.quote}
                onChange={this.handleInputChange}
                placeholder="Enter your answer"
                maxLength={MAX_QUOTE_LEN}
              />
              <Spacer />
            </FormField>
          ) : null}

          <div>
            <FormField>
              <label htmlFor="form-name">Name: </label>
              <input
                required
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                name="email"
                id="form-email"
                placeholder="Enter your email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </FormField>
          </div>

          <div>
            {loading ? (
              <LoadingSubmitButton />
            ) : (
              <SubmitButton
                type="submit"
                value="Submit"
                disabled={!this.validate()}
              />
            )}
          </div>
        </FlexContainer>
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

  validate() {
    const validQuote =
      0 < this.state.quote.length && this.state.quote.length < MAX_QUOTE_LEN;
    const validEmail = validateEmail(this.state.email);
    return (
      validQuote &&
      validEmail &&
      this.state.name !== "" &&
      this.state.country !== ""
    );
  }
}
