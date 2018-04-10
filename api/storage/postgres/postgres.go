package postgres

import (
	"database/sql"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"

	// postgres drivers
	_ "github.com/GoogleCloudPlatform/cloudsql-proxy/proxy/dialers/postgres"

	"github.com/chrfrasco/sharing-wall/storage"
)

// Conf contains the params needed to init the database connection
type Conf struct {
	Host, Name, User, Pass string
}

type postgres struct {
	db *sql.DB
}

// New creates a new postgres-backed storage service
func New(c Conf) (storage.Service, error) {
	conn := fmt.Sprintf("host=%s dbname=%s user=%s password=%s sslmode=disable", c.Host, c.Name, c.User, c.Pass)
	db, err := sql.Open("cloudsqlpostgres", conn)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	query := `
	DROP TABLE IF EXISTS "quote";
	DROP TABLE IF EXISTS "user";

	CREATE TABLE "quote" (
	  id       SERIAL PRIMARY KEY,
	  body     TEXT NOT NULL,
	  fullname TEXT NOT NULL,
	  email    TEXT NOT NULL,
	  country  TEXT NOT NULL,
	  img      TEXT NOT NULL,
	  quoteID  TEXT NOT NULL
	);

	CREATE TABLE "user" (
		id SERIAL PRIMARY KEY,
		username TEXT NOT NULL,
		hash TEXT NOT NULL
	)
	`
	_, err = db.Exec(query)
	if err != nil {
		return nil, err
	}

	query = `
	INSERT INTO "quote" (body, fullname, email, country, img, quoteID)
	VALUES ('I am not a rapper', 'Christian Scott', 'New Zealand', 'mail@mail.com', 'https://foo.com/pic', $1);
	`
	_, err = db.Exec(query, genQuoteID())
	if err != nil {
		return nil, err
	}

	query = `INSERT INTO "user" (username, hash) VALUES ($1, $2);`
	username, password := "foobar", "foobar3000"
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(query, username, hash)
	if err != nil {
		return nil, err
	}

	return &postgres{db}, nil
}

// Close terminates the database connection
func (p *postgres) Close() {
	p.db.Close()
}

func (p *postgres) GetPassHash(user string) (string, error) {
	query := `SELECT u.hash FROM "user" u WHERE u.username = $1`
	rows, err := p.db.Query(query, user)
	if err != nil {
		return "", fmt.Errorf("could not get hash: %v", err)
	}
	if !rows.Next() {
		return "", errors.New("no such user")
	}

	var hash string
	err = rows.Scan(&hash)
	if err != nil {
		return "", fmt.Errorf("could not scan: %v", err)
	}

	return hash, nil
}

func (p *postgres) GetQuote(qID string) (*storage.Quote, error) {
	query := `
	SELECT body, fullname, email, country, img, quoteID
	FROM "quote"
	WHERE quoteID = $1`
	rows, err := p.db.Query(query, qID)
	if err != nil {
		return nil, fmt.Errorf("could not get quote: %v", err)
	}

	if !rows.Next() {
		return nil, nil
	}

	var q storage.Quote
	err = rows.Scan(&q.Body, &q.Name, &q.Email, &q.Country, &q.Img, &q.QuoteID)
	if err != nil {
		return nil, fmt.Errorf("could not scan: %v", err)
	}

	return &q, nil
}

// ListQuotes returns n quotes
func (p *postgres) ListQuotes(n int) ([]storage.Quote, error) {
	q := `
	SELECT body, fullname, email, country, img, quoteID
	FROM "quote"
	LIMIT $1`
	rows, err := p.db.Query(q, n)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	quotes := []storage.Quote{}
	for rows.Next() {
		var q storage.Quote
		err = rows.Scan(&q.Body, &q.Name, &q.Email, &q.Country, &q.Img, &q.QuoteID)
		if err != nil {
			return nil, err
		}
		quotes = append(quotes, q)
	}

	return quotes, nil
}

// AddQuote persists a quote to the database
func (p postgres) AddQuote(qt storage.Quote) error {
	q := `INSERT INTO "quote" (body, fullname, email, country, img, quoteID)
	VALUES ($1, $2, $3, $4, $5, $6);`
	_, err := p.db.Exec(q, qt.Body, qt.Name, qt.Email, qt.Country, qt.Img, genQuoteID())
	if err != nil {
		return fmt.Errorf("could not insert: %v", err)
	}

	return nil
}

func (p postgres) DeleteQuote(qID string) error {
	q := `DELETE FROM "quote" WHERE quoteID = $1`
	_, err := p.db.Exec(q, qID)
	if err != nil {
		return fmt.Errorf("could not delete: %v", err)
	}

	return nil
}

var i = 3000

func genQuoteID() string {
	i++
	return fmt.Sprintf("foobar%d", i)
}