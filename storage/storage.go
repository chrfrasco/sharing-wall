package storage

// Service provides a RDBMS-agnostic storage interface
type Service interface {
	ListQuotes(n int) ([]Quote, error)
	AddQuote(q Quote) error
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
