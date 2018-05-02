package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/chrfrasco/sharing-wall/api/upload"

	"github.com/fatih/color"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/text/language"

	"github.com/chrfrasco/sharing-wall/api/lang"
	"github.com/chrfrasco/sharing-wall/api/storage"
)

var red = color.New(color.FgRed).SprintFunc()

type handler struct {
	svc    storage.Service
	up     upload.Uploader
	imgURL string
}

type handleFunc func(http.ResponseWriter, *http.Request) (interface{}, int, error)

// New creates a handler instance for the quote service
func New(svc storage.Service, up upload.Uploader, imgURL string) http.Handler {
	mux := http.NewServeMux()
	h := handler{svc, up, imgURL}
	mux.HandleFunc("/api/message", responseHandler(h.message))
	mux.HandleFunc("/api/quote", responseHandler(h.quote))
	mux.HandleFunc("/api/quotes", responseHandler(h.quotes))
	return mux
}

// handleInternalError logs the error (with context) and returns a clean 500
// response to the client
func handleInternalError(err error, message string) (interface{}, int, error) {
	log.Printf(red("%s: %v\n"), message, err)
	return nil, http.StatusInternalServerError, nil
}

// authResponseHandler wraps a route, forcing that route to be authenticated
func (h handler) authResponseHandler(hf handleFunc) handleFunc {
	authFailedMessage := "not authorized"

	return func(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
		w.Header().Set("WWW-Authenticate", `Basic Realm="Restricted"`)
		user, pass, ok := r.BasicAuth()
		if ok == false {
			log.Print(red("bad auth header"))
			return nil, http.StatusUnauthorized, errors.New(authFailedMessage)
		}

		hash, err := h.svc.GetPassHash(user)
		if err != nil {
			return handleInternalError(err, red("failed to get hash"))
		}
		if hash == nil {
			log.Print(red("no such user"))
			return nil, http.StatusUnauthorized, errors.New(authFailedMessage)
		}

		if err = bcrypt.CompareHashAndPassword([]byte(*hash), []byte(pass)); err != nil {
			log.Printf(red("bad password %v"), pass)
			return nil, http.StatusUnauthorized, errors.New(authFailedMessage)
		}

		return hf(w, r)
	}
}

// responseHandler is a HOF wraps other handlers, abstracting away the return of JSON those handlers.
// the wrapped function's first return value can be an arbitrary blob of data that will be serialized to
// JSON.
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

// smoke-test endpoint that tries to guess if the client is German or Otherwise
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

// quotes returns the top 20 quotes in the database
// TODO: return most recently added first (or some other sorting mechanism) AND add pagination
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
		return handleInternalError(err, "could not retrieve from database")
	}

	return quotes, http.StatusOK, nil
}
