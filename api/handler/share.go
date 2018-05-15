package handler

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
)

func (h handler) handleShareQuote(w http.ResponseWriter, r *http.Request) {
	quoteID := r.URL.Query().Get("quoteID")
	if quoteID == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "missing quoteID url param")
		return
	}

	quote, err := h.svc.GetQuote(quoteID)
	switch {
	case err == sql.ErrNoRows:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "could not find quote %s", quoteID)
		return
	case err != nil:
		log.Printf(red("could not retrieve quote: %v"), err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, "internal server error")
		return
	}

	h.shareTemplate.Execute(w, quote)
}
