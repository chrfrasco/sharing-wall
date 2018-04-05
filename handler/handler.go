package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"golang.org/x/text/language"

	"github.com/chrfrasco/sharing-wall/lang"
	"github.com/chrfrasco/sharing-wall/storage"
)

type handler struct {
	svc storage.Service
}

// New creates a handler instance for the quote service
func New(svc storage.Service) http.Handler {
	mux := http.NewServeMux()
	h := handler{svc}
	mux.HandleFunc("/api/message", responseHandler(h.message))
	mux.HandleFunc("/api/quotes", responseHandler(h.quotes))
	mux.HandleFunc("/api/add", responseHandler(h.add))
	return mux
}

func responseHandler(h func(io.Writer, *http.Request) (interface{}, int, error)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data, status, err := h(w, r)
		if err != nil {
			data = err.Error()
		}

		if status == http.StatusInternalServerError {
			data = "Sorry - something went wrong"
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		err = json.NewEncoder(w).Encode(data)
		if err != nil {
			log.Printf("could not encode response to output: %v", err)
		}
	}
}

func (h handler) message(w io.Writer, r *http.Request) (interface{}, int, error) {
	if r.Method != http.MethodGet {
		return nil, http.StatusMethodNotAllowed, nil
	}

	var msg string
	switch tag := lang.FromRequest(r); tag {
	case language.English:
		msg = "Hello from Golang"
	case language.German:
		msg = "Hallo von Golang"
	}

	return msg, http.StatusOK, nil
}

func (h handler) quotes(w io.Writer, r *http.Request) (interface{}, int, error) {
	if r.Method != http.MethodGet {
		return nil, http.StatusMethodNotAllowed, fmt.Errorf("Method %s not allowed", r.Method)
	}

	limitStr := r.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 10
	}

	if limit < 0 {
		return nil, http.StatusBadRequest, fmt.Errorf("Negative limit")
	}

	quotes, err := h.svc.ListQuotes(limit)
	if err != nil {
		log.Printf("could not retrieve from database: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}

	return quotes, http.StatusOK, nil
}

func (h handler) add(w io.Writer, r *http.Request) (interface{}, int, error) {
	if r.Method != http.MethodPost {
		return nil, http.StatusMethodNotAllowed, fmt.Errorf("Method %s not allowed", r.Method)
	}

	var input struct{ Name, Email, Body string }
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		return nil, http.StatusBadRequest, fmt.Errorf("unable to decode JSON request body: %v", err)
	}

	var q storage.Quote
	q.Name = strings.TrimSpace(input.Name)
	q.Email = strings.TrimSpace(input.Email)
	q.Body = strings.TrimSpace(input.Body)

	for _, s := range []string{q.Name, q.Email, q.Body} {
		if s == "" {
			return nil, http.StatusBadRequest, fmt.Errorf("all of name, email, body must be set")
		}
	}

	err := h.svc.AddQuote(q)
	if err != nil {
		log.Printf("could not add to database: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}

	return q, http.StatusOK, nil
}