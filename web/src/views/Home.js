//@ts-check
import React from "react";
import QuotePreview from "../components/QuotePreview";

function capitalise(s = "") {
  return `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`;
}

function Labelled({ children, label, forID }) {
  return (
    <div>
      <label htmlFor={forID}>{label}</label>
      {children}
    </div>
  );
}

function LabelledInput({ name, placeholder, type = "text", label }) {
  if (!label) {
    label = capitalise(name);
  }
  const forID = `form-element-${name}`;

  return (
    <Labelled label={label} forID={forID}>
      <input name={name} id={forID} placeholder={placeholder} type={type} />
    </Labelled>
  );
}

export default class Home extends React.Component {
  state = {
    name: "",
    email: "",
    quote: ""
  };

  constructor(props) {
    super(props);
    this.handleQuoteChange = this.handleQuoteChange.bind(this);
  }

  render() {
    return (
      <form
        action="/api/add-quote"
        method="post"
        onSubmit={e => e.preventDefault()}
      >
        <QuotePreview 
          quote={this.state.quote} 
          handleQuoteChange={this.handleQuoteChange}
        />

        <LabelledInput name="name" placeholder="Enter your name" />
        <LabelledInput
          name="country"
          placeholder="Enter your country of residence"
        />
        <LabelledInput
          name="email"
          type="email"
          placeholder="Enter your email address"
        />
      </form>
    );
  }

  handleQuoteChange(ev) {
    this.setState({ quote: ev.target.value });
  }
}
