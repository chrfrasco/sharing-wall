package handler

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/chrfrasco/sharing-wall/api/storage"
)

type clientQuote struct {
	Name, Email, Body, Country string
}

func fromRequest(r *http.Request) (*clientQuote, error) {
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
	q.QuoteID, _ = genRandomString(16)
	return q
}

func genRandomString(n int) (string, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(b), err
}
