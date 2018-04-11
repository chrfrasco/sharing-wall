package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/fatih/color"
	"github.com/joho/godotenv"

	"github.com/chrfrasco/sharing-wall/api/handler"
	"github.com/chrfrasco/sharing-wall/api/storage/postgres"
)

var cyan = color.New(color.FgCyan).SprintFunc()

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

	addr := fmt.Sprintf("%s:%s", os.Getenv("SV_HOST"), os.Getenv("SV_PORT"))
	server := http.Server{
		Addr:    addr,
		Handler: handler.New(svc),
	}

	go func() {
		sigquit := make(chan os.Signal, 1)
		signal.Notify(sigquit, os.Interrupt, os.Kill)

		sig := <-sigquit
		log.Printf("caught sig: %+v", sig)
		log.Printf("Gracefully shutting down server...")

		if err := server.Shutdown(context.Background()); err != nil {
			log.Printf("Unable to shut down server: %v", err)
		} else {
			log.Println("Server stopped")
		}
	}()

	log.Printf(cyan("Server listening on http://%s\n"), addr)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Printf("%v", err)
	} else {
		log.Println("Server has shut down")
	}
}

func fatalf(template string, args ...interface{}) {
	log.Fatal(fmt.Sprintf(template, args...))
}
