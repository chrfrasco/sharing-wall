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
	"github.com/chrfrasco/sharing-wall/api/upload/amazons3"
)

var cyan = color.New(color.FgCyan).SprintFunc()

func main() {
	if _, err := os.Stat(".env"); err == nil {
		err := godotenv.Load()
		if err != nil {
			fatalf("Error loading .env file: %v\n", err)
		}
	}

	svc, err := postgres.New(os.Getenv("DATABASE_URL"))
	if err != nil {
		fatalf("could not init handler: %v\n", err)
	}
	defer svc.Close()

	as3, err := amazons3.New(os.Getenv("AWS_ACCESS"), os.Getenv("AWS_SECRET"), os.Getenv("AWS_BUCKET"))
	if err != nil {
		fatalf("could not init S3 connection: %v\n", err)
	}

	var addr string
	host, port := os.Getenv("HOST"), os.Getenv("PORT")
	if host == "" {
		addr = fmt.Sprintf(":%s", port)
	} else {
		addr = fmt.Sprintf("%s:%s", host, port)
	}

	imgURL := os.Getenv("IMG_URL")
	server := http.Server{
		Addr:    addr,
		Handler: handler.New(svc, as3, imgURL),
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

	log.Printf(cyan("Server listening on //%s\n"), addr)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Printf("%v", err)
	} else {
		log.Println("Server has shut down")
	}
}

func fatalf(template string, args ...interface{}) {
	log.Fatal(fmt.Sprintf(template, args...))
}
