package handler

import (
	"fmt"
	"net/http"

	"golang.org/x/text/language"

	"github.com/chrfrasco/sharing-wall/server/lang"
	"github.com/chrfrasco/sharing-wall/server/storage"
)

type Handler struct {
	svc storage.Service
}

// New creates a handler instance
func New(svc storage.Service) *Handler {
	return &Handler{svc}
}

// Message sends a json-encoded message based on the client's language settings
func (h *Handler) Message(w http.ResponseWriter, r *http.Request) {
	var msg string
	switch tag := lang.FromRequest(r); tag {
	case language.English:
		msg = "Hello from Golang"
	case language.German:
		msg = "Hallo von Golang"
	}

	sendJSON(w, fmt.Sprintf(`{ "msg": "%s" }`, msg))
}

func (h *Handler) Quotes(w http.ResponseWriter, r *http.Request) {
	sendJSON(w, `{ "quotes": [] }`)
}

func sendJSON(w http.ResponseWriter, json string) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprint(w, json)
}
