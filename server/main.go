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
		fatalf("Error loading .env file: %v\n", err)
	}

	svc, err := postgres.New(os.Getenv("PG_CONN"))
	if err != nil {
		fatalf("could not init handler: %v\n", err)
	}
	defer svc.Close()

	h := handler.New(svc)
	http.HandleFunc("/api/message", h.Message)
	http.HandleFunc("/api/quotes", h.Quotes)

	fmt.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func fatalf(template string, args ...interface{}) {
	log.Fatal(fmt.Sprintf(template, args...))
}
