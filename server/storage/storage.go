package storage

import "golang.org/x/text/language"

type Service interface {
	New() *Service
	ListQuotes(n int, locale language.Tag) []string
	Close()
}
