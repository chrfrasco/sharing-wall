package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/chrfrasco/sharing-wall/server/handler"
	"github.com/chrfrasco/sharing-wall/server/storage/postgres"
)

func main() {
	svc, err := postgres.New("host=127.0.0.1 port=5432 user=christianscott dbname=twohundredquotes sslmode=disable")
	if err != nil {
		log.Fatal(fmt.Sprintf("could not init handler: %v\n", err))
	}

	h := handler.New(svc)
	http.HandleFunc("/api/message", h.Message)
	http.HandleFunc("/api/quotes", h.Quotes)

	fmt.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
