package handler

import (
	"fmt"
	"net/http"

	"golang.org/x/text/language"

	"github.com/chrfrasco/sharing-wall/server/lang"
)

type Handler struct {
}

func (h *Handler) Message(w http.ResponseWriter, r *http.Request) {
	var msg string
	switch tag := lang.FromRequest(r); tag {
	case language.English:
		msg = "Hello from Golang"
	case language.German:
		msg = "Hallo von Golang"
	}

	fmt.Fprintf(w, `{ "msg": "%s" }`, msg)
}
