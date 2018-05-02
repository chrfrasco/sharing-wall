package handler

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"

	"github.com/chrfrasco/sharing-wall/api/storage"
)

type clientQuote struct {
	Name, Email, Body, Country string
}

func clientQuoteFromRequest(r *http.Request) (*clientQuote, error) {
	var cq clientQuote
	if err := json.NewDecoder(r.Body).Decode(&cq); err != nil {
		return nil, fmt.Errorf("unable to decode JSON request body: %v", err)
	}
	return &cq, nil
}

func (cq clientQuote) get(p string) string {
	switch p {
	case "Name":
		return cq.Name
	case "Email":
		return cq.Email
	case "Body":
		return cq.Body
	case "Country":
		return cq.Country
	default:
		return ""
	}
}

func (cq clientQuote) validate() (bool, string) {
	missing := make([]string, 0)
	for _, p := range []string{"Name", "Email", "Body", "Country"} {
		if strings.TrimSpace(cq.get(p)) == "" {
			missing = append(missing, p)
		}
	}
	if len(missing) > 0 {
		return false, fmt.Sprintf("missing %s", strings.Join(missing, ", "))
	}

	return true, ""
}

func (cq clientQuote) toQuote() storage.Quote {
	var q storage.Quote
	q.Name = strings.TrimSpace(cq.Name)
	q.Email = strings.TrimSpace(cq.Email)
	q.Body = strings.TrimSpace(cq.Body)
	q.Country = strings.TrimSpace(cq.Country)
	q.QuoteID = GenQuoteID()
	return q
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

// GenQuoteID generates a (probably) unique id for a quote
func GenQuoteID() string {
	return genRandomString(16)
}

func genRandomString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}
