package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/fatih/color"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/text/language"

	"github.com/chrfrasco/sharing-wall/api/lang"
	"github.com/chrfrasco/sharing-wall/api/storage"
)

var red = color.New(color.FgRed).SprintFunc()

type handler struct {
	svc storage.Service
}

type handleFunc func(http.ResponseWriter, *http.Request) (interface{}, int, error)

// New creates a handler instance for the quote service
func New(svc storage.Service) http.Handler {
	mux := http.NewServeMux()
	h := handler{svc}
	mux.HandleFunc("/api/message", responseHandler(h.message))
	mux.HandleFunc("/api/quote", responseHandler(h.quote))
	mux.HandleFunc("/api/quotes", responseHandler(h.quotes))
	return mux
}

var authFailedMessage = "not authorized"

func authResponseHandler(svc storage.Service, h handleFunc) http.HandlerFunc {
	return responseHandler(func(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
		w.Header().Set("WWW-Authenticate", `Basic Realm="Restricted"`)
		user, pass, ok := r.BasicAuth()
		if ok == false {
			log.Print(red("bad auth header"))
			return nil, http.StatusUnauthorized, errors.New(authFailedMessage)
		}

		hash, err := svc.GetPassHash(user)
		if err != nil {
			log.Printf(red("failed to get hash %v"), err)
			return nil, http.StatusInternalServerError, nil
		}
		if err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(pass)); err != nil {
			log.Printf(red("bad password %v"), pass)
			return nil, http.StatusUnauthorized, errors.New(authFailedMessage)
		}

		return h(w, r)
	})
}

func responseHandler(h func(http.ResponseWriter, *http.Request) (interface{}, int, error)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data, status, err := h(w, r)
		if err != nil {
			log.Printf(red("%v"), err)
			data = err.Error()
		}

		if status == http.StatusInternalServerError {
			data = "oops"
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		err = json.NewEncoder(w).Encode(data)
		if err != nil {
			log.Printf(red("could not encode response to output: %v"), err)
		}
	}
}

func (h handler) message(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
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

func (h handler) quote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	if r.Method == http.MethodGet {
		return h.getQuote(w, r)
	}

	if r.Method == http.MethodPost {
		return h.addQuote(w, r)
	}

	if r.Method == http.MethodDelete {
		return h.deleteQuote(w, r)
	}

	return nil, http.StatusMethodNotAllowed, fmt.Errorf("method %s not allowed", r.Method)
}

func (h handler) getQuote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	quoteID := r.URL.Query().Get("quoteID")
	if quoteID == "" {
		return nil, http.StatusBadRequest, fmt.Errorf("missing quoteID url param")
	}

	quote, err := h.svc.GetQuote(quoteID)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	if quote == nil {
		return nil, http.StatusNotFound, fmt.Errorf("could not find quote %s", quoteID)
	}

	return quote, http.StatusOK, nil
}

func (h handler) addQuote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
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

func (h handler) deleteQuote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	var input struct {
		QuoteID  string
		QuoteIDs []string
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		return nil, http.StatusBadRequest, fmt.Errorf("unable to decode JSON request body: %v", err)
	}

	if input.QuoteID != "" {
		err := h.svc.DeleteQuote(input.QuoteID)
		if err != nil {
			log.Printf("could not delete from database: %v\n", err)
			return nil, http.StatusInternalServerError, nil
		}

		return nil, http.StatusOK, nil
	}

	if len(input.QuoteIDs) > 0 {
		for _, qID := range input.QuoteIDs {
			err := h.svc.DeleteQuote(qID)
			if err != nil {
				log.Printf("could not delete from database: %v\n", err)
				return nil, http.StatusInternalServerError, nil
			}
		}

		return nil, http.StatusOK, nil
	}

	return nil, http.StatusBadRequest, fmt.Errorf("must provide a quoteID or an array of quoteIDs")
}

func (h handler) quotes(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	if r.Method != http.MethodGet {
		return nil, http.StatusMethodNotAllowed, fmt.Errorf("method %s not allowed", r.Method)
	}

	limitStr := r.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 10
	}

	if limit < 0 {
		return nil, http.StatusBadRequest, fmt.Errorf("negative limit")
	}

	quotes, err := h.svc.ListQuotes(limit)
	if err != nil {
		log.Printf("could not retrieve from database: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}

	return quotes, http.StatusOK, nil
}
