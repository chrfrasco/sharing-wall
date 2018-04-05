package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/chrfrasco/sharing-wall/server/handler"
	"github.com/chrfrasco/sharing-wall/server/storage/postgres"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	svc, err := postgres.New(os.Getenv("PG_CONN"))
	if err != nil {
		log.Fatal(fmt.Sprintf("could not init handler: %v\n", err))
	}

	h := handler.New(svc)
	http.HandleFunc("/api/message", h.Message)
	http.HandleFunc("/api/quotes", h.Quotes)

	fmt.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
