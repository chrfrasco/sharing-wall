package postgres

import (
	"database/sql"
	"fmt"

	"github.com/chrfrasco/sharing-wall/server/storage"
	// postgres drivers
	_ "github.com/GoogleCloudPlatform/cloudsql-proxy/proxy/dialers/postgres"
)

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
	DROP TABLE IF EXISTS quote_;
	DROP TABLE IF EXISTS quotes_user;

	CREATE TABLE quotes_user (
	  userID   SERIAL PRIMARY KEY,
	  fullname TEXT NOT NULL,
	  email    TEXT NOT NULL,
	  country  TEXT NOT NULL
	);

	CREATE TABLE quote_ (
	  quoteID SERIAL PRIMARY KEY,
	  body    TEXT NOT NULL,
	  userID  INT,
	  FOREIGN KEY (userID) REFERENCES quotes_user(userID)
	);

	INSERT INTO quotes_user (fullname, email, country)
	VALUES ('Christian Scott', 'New Zealand', 'mail@mail.com');

	INSERT INTO quote_ (body, userID)
	VALUES ('I am not a rapper', 1);
	`
	_, err = db.Exec(query)
	if err != nil {
		return nil, err
	}

	return &postgres{db}, nil
}

func (p *postgres) Close() {
	p.db.Close()
}

func (p *postgres) ListQuotes(n int) ([]storage.Quote, error) {
	q := `
	SELECT u.fullname, q.body
	FROM quotes_user u
	JOIN quote_ q ON q.userID = u.userID
	LIMIT $1`
	rows, err := p.db.Query(q, n)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	quotes := []storage.Quote{}
	for rows.Next() {
		var q storage.Quote
		err = rows.Scan(&q.QuoteText, &q.Name)
		if err != nil {
			return nil, err
		}
		quotes = append(quotes, q)
	}

	return quotes, nil
}
