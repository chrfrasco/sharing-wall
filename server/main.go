package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/chrfrasco/sharing-wall/server/handler"
	// postgres drivers
	_ "github.com/lib/pq"
)

func main() {
	h := &handler.Handler{}

	http.HandleFunc("/api/message", h.Message)

	fmt.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
