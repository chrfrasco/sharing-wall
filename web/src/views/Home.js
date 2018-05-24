import React from "react";
import * as Fetchers from "../fetchers";
import QuoteSubmissionForm from "../components/QuoteSubmissionForm";

export default function Home() {
  return (
    <Fetchers.SubmitQuote>
      {({ isSubmitting, submitQuote }) => (
        <QuoteSubmissionForm
          isSubmitting={isSubmitting}
          submitQuote={submitQuote}
        />
      )}
    </Fetchers.SubmitQuote>
  );
}
