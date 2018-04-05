package storage

// Service provides a RDBMS-agnostic storage interface
type Service interface {
	ListQuotes(n int) ([]Quote, error)
	Close()
}

// Quote represents a single user-submitted quote
type Quote struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Country   string `json:"country"`
	QuoteText string `json:"quote"`
	ImageURL  string `json:"quoteimgurl"`
	QuoteID   string `json:"quoteID"`
}
