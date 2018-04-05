package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/chrfrasco/sharing-wall/server/handler"
	"github.com/chrfrasco/sharing-wall/server/storage/postgres"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fatalf("Error loading .env file: %v\n", err)
	}

	pgConf := postgres.Conf{
		Host: os.Getenv("PG_HOST"),
		Name: os.Getenv("PG_NAME"),
		User: os.Getenv("PG_USER"),
		Pass: os.Getenv("PG_PASS"),
	}
	svc, err := postgres.New(pgConf)
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

	fmt.Printf("\033c Listening on http://%s\n", addr)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Printf("%v", err)
	} else {
		log.Println("Server has shut down")
	}
}

func fatalf(template string, args ...interface{}) {
	log.Fatal(fmt.Sprintf(template, args...))
}
