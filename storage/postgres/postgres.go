package postgres

import (
	"database/sql"
	"fmt"

	"github.com/chrfrasco/sharing-wall/storage"
	// postgres drivers
	_ "github.com/GoogleCloudPlatform/cloudsql-proxy/proxy/dialers/postgres"
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
	DROP TABLE IF EXISTS quote_;
	DROP TABLE IF EXISTS quotes_user;

	CREATE TABLE "quote" (
	  id       SERIAL PRIMARY KEY,
	  body     TEXT NOT NULL,
	  fullname TEXT NOT NULL,
	  email    TEXT NOT NULL,
	  country  TEXT NOT NULL,
	  img      TEXT NOT NULL
	);

	INSERT INTO "quote" (body, fullname, email, country, img)
	VALUES ('I am not a rapper', 'Christian Scott', 'New Zealand', 'mail@mail.com', 'https://foo.com/pic');
	`
	_, err = db.Exec(query)
	if err != nil {
		return nil, err
	}

	return &postgres{db}, nil
}

// Close terminates the database connection
func (p *postgres) Close() {
	p.db.Close()
}

// ListQuotes returns n quotes
func (p *postgres) ListQuotes(n int) ([]storage.Quote, error) {
	q := `
	SELECT q.fullname, q.body
	FROM "quote" q
	LIMIT $1`
	rows, err := p.db.Query(q, n)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	quotes := []storage.Quote{}
	for rows.Next() {
		var q storage.Quote
		err = rows.Scan(&q.Name, &q.Body)
		if err != nil {
			return nil, err
		}
		quotes = append(quotes, q)
	}

	return quotes, nil
}

// AddQuote persists a quote to the database
func (p postgres) AddQuote(qt storage.Quote) error {
	q := `INSERT INTO "quote" (body, fullname, email, country, img)
	VALUES ($1, $2, $3, $4, $5);`
	_, err := p.db.Exec(q, qt.Body, qt.Name, qt.Email, qt.Country, qt.Img)
	if err != nil {
		return fmt.Errorf("could not insert: %v", err)
	}

	return nil
}
