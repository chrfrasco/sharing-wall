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

var authFailedMessage = "not authorized"

func (h handler) authResponseHandler(hf handleFunc) handleFunc {
	return func(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
		w.Header().Set("WWW-Authenticate", `Basic Realm="Restricted"`)
		user, pass, ok := r.BasicAuth()
		if ok == false {
			log.Print(red("bad auth header"))
			return nil, http.StatusUnauthorized, errors.New(authFailedMessage)
		}

		hash, err := h.svc.GetPassHash(user)
		if err != nil {
			log.Printf(red("failed to get hash: %v"), err)
			return nil, http.StatusInternalServerError, nil
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
