package storage

// Service provides a RDBMS-agnostic storage interface
type Service interface {
	ListQuotes(n int) []string
	Close()
}
