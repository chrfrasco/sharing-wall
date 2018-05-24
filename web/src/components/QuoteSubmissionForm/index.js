import React from "react";
import QuotePreviewWrapper from "./QuotePreviewWrapper";
import {
  FlexContainer,
  FormField,
  Spacer,
  SubmitButton,
  LoadingSubmitButton
} from "../elements";
import {
  IS_DEVICE_TOUCHSCREEN,
  IS_PRODUCTION,
  MAX_QUOTE_LEN
} from "../../constants";
import { getFontSizeClassName, rand, validateQuote } from "../../utils";

const initialQuote = IS_PRODUCTION
  ? {
      body: "",
      name: "",
      email: "",
      country: "",
      backgroundVersion: rand(1, 4)
    }
  : {
      body: "Treating others as I would have them treat me.",
      name: "Christian Scott",
      email: "christianfscott@gmail.com",
      country: "New Zealand",
      backgroundVersion: rand(1, 4)
    };

class QuoteSubmissionForm extends React.Component {
  state = { quote: initialQuote };

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  render() {
    const textareaPlaceholder = IS_DEVICE_TOUCHSCREEN
      ? "Type your answer below"
      : "Type here";

    const textAreaClassName = [
      "quote__body",
      "row",
      getFontSizeClassName(this.state.quote.body)
    ].join(" ");

    return (
      <form onSubmit={this.handleFormSubmit}>
        <QuotePreviewWrapper
          bgVersion={this.state.quote.backgroundVersion}
          name={this.state.quote.name}
        >
          <textarea
            name="body"
            className={textAreaClassName}
            ref={this.textArea}
            value={this.state.quote.body}
            onChange={this.handleInputChange}
            placeholder={textareaPlaceholder}
            readOnly={IS_DEVICE_TOUCHSCREEN}
            disabled={this.props.isSubmitting || IS_DEVICE_TOUCHSCREEN}
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
              <label htmlFor="form-body">What matters to you?</label>
              <textarea
                required
                disabled={this.props.isSubmitting}
                name="body"
                id="form-body"
                value={this.state.quote.body}
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
                disabled={this.props.isSubmitting}
                autoComplete="name"
                name="name"
                id="form-name"
                placeholder="Enter your name"
                value={this.state.quote.name}
                onChange={this.handleInputChange}
              />
            </FormField>

            <FormField>
              <label htmlFor="form-country">Country: </label>
              <input
                required
                disabled={this.props.isSubmitting}
                name="country"
                id="form-country"
                autoComplete="address-level1"
                placeholder="Enter your country"
                value={this.state.quote.country}
                onChange={this.handleInputChange}
              />
            </FormField>

            <FormField>
              <label htmlFor="form-email">Email: </label>
              <input
                type="email"
                required
                disabled={this.props.isSubmitting}
                name="email"
                id="form-email"
                placeholder="Enter your email"
                value={this.state.quote.email}
                onChange={this.handleInputChange}
              />
            </FormField>
          </div>

          <div>
            {this.props.isSubmitting ? (
              <LoadingSubmitButton />
            ) : (
              <SubmitButton
                type="submit"
                value="Submit"
                disabled={!validateQuote(this.state.quote)}
              />
            )}
          </div>
        </FlexContainer>
      </form>
    );
  }

  handleInputChange(ev) {
    const name = ev.target.name;
    const value = ev.target.value;
    this.setState(state => ({
      quote: { ...state.quote, [name]: value }
    }));
  }

  handleFormSubmit(ev) {
    ev.preventDefault();
    this.props.submitQuote(this.state.quote);
  }
}

export default QuoteSubmissionForm;
