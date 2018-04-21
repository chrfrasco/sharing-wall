package storage

import "errors"

// Service provides a RDBMS-agnostic storage interface
type Service interface {
	GetPassHash(user string) (*string, error)
	GetQuote(qID string) (*Quote, error)
	ListQuotes(n int) ([]Quote, error)
	AddQuote(q Quote) (*Quote, error)
	DeleteQuote(qID string) error
	Close()
}

// Quote represents a single user-submitted quote
type Quote struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Country string `json:"country"`
	Body    string `json:"body"`
	Img     string `json:"img"`
	QuoteID string `json:"quoteID"`
}

// ErrDuplicateKey signals that the supplied QuoteID already exists in the database
var ErrDuplicateKey = errors.New("QuoteID already exists")
