package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// top-level quote handler passes on requests to other handlers based on the request method
func (h handler) quote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	if r.Method == http.MethodGet {
		return h.getQuote(w, r)
	}

	if r.Method == http.MethodPost {
		return h.addQuote(w, r)
	}

	if r.Method == http.MethodDelete {
		return h.deleteQuote(w, r)
	}

	return nil, http.StatusMethodNotAllowed, fmt.Errorf("method %s not allowed", r.Method)
}

// getQuote tries to return a quote matching the supplied quoteID url param. If no matching quote
// is found, return 404
//
// GET /api/quote?quoteID=foobar3000
// 	-> 404 could not find quote foobar3000
//
// GET /api/quote?quoteID=foobar3001
//      -> 200 OK { ... }
//
func (h handler) getQuote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	quoteID := r.URL.Query().Get("quoteID")
	if quoteID == "" {
		return nil, http.StatusBadRequest, fmt.Errorf("missing quoteID url param")
	}

	quote, err := h.svc.GetQuote(quoteID)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	if quote == nil {
		return nil, http.StatusNotFound, fmt.Errorf("could not find quote %s", quoteID)
	}

	return quote, http.StatusOK, nil
}

// addQuote handles a post request and attempts to add it to the database. If the request body
// is valid and the INSERT succeeds, the image generation service is queried and the resulting
// png is stored. The client is returned a new "quote" object with additional quoteID and img (url)
// properties.
//
// POST /api/quote {}
// 	-> 400 BAD REQUEST all of name, email, body, country must be set
//
// POST /api/quote { "name": "...", "email": "...", "body": "...", "country": "..." }
// 	-> 200 OK { ..., "quoteID": "...", "img": "http://some.storage.service" }
//
func (h handler) addQuote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	var input struct{ Name, Email, Body, Country string }
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		return nil, http.StatusBadRequest, fmt.Errorf("unable to decode JSON request body: %v", err)
	}

	var q storage.Quote
	q.Name = strings.TrimSpace(input.Name)
	q.Email = strings.TrimSpace(input.Email)
	q.Body = strings.TrimSpace(input.Body)
	q.Country = strings.TrimSpace(input.Country)

	for _, s := range []string{q.Name, q.Email, q.Body, q.Country} {
		if s == "" {
			return nil, http.StatusBadRequest, fmt.Errorf("all of name, email, body, country must be set")
		}
	}

	qp, err := h.svc.AddQuote(q)
	if err != nil {
		log.Printf("could not add to database: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}
	q = *qp

	rq := struct {
		Quote string `json:"quote"`
		Name  string `json:"name"`
	}{Quote: q.Body, Name: q.Name}

	jsonString, err := json.Marshal(rq)
	if err != nil {
		log.Printf("could encode json: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}

	imgResp, err := http.Post("http://img:5000", "application/json", bytes.NewBuffer(jsonString))
	if err != nil {
		log.Printf("could not request image: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}
	defer imgResp.Body.Close()

	jsonBody, err := ioutil.ReadAll(imgResp.Body)
	if err != nil {
		log.Printf("could read response body: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}

	var res struct {
		Png string `json:"png"`
	}
	err = json.Unmarshal(jsonBody, &res)
	if err != nil {
		log.Printf("could not unmarshal img response: %v\n", err)
		return nil, http.StatusInternalServerError, nil
	}
	q.Img = res.Png

	return q, http.StatusOK, nil
}

// deleteQuote removes a quote from the database. This route should be authenticated.
func (h handler) deleteQuote(w http.ResponseWriter, r *http.Request) (interface{}, int, error) {
	var input struct {
		QuoteID  string
		QuoteIDs []string
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		return nil, http.StatusBadRequest, fmt.Errorf("unable to decode JSON request body: %v", err)
	}

	if input.QuoteID != "" {
		err := h.svc.DeleteQuote(input.QuoteID)
		if err != nil {
			log.Printf("could not delete from database: %v\n", err)
			return nil, http.StatusInternalServerError, nil
		}

		return nil, http.StatusOK, nil
	}

	if len(input.QuoteIDs) > 0 {
		for _, qID := range input.QuoteIDs {
			err := h.svc.DeleteQuote(qID)
			if err != nil {
				log.Printf("could not delete from database: %v\n", err)
				return nil, http.StatusInternalServerError, nil
			}
		}

		return nil, http.StatusOK, nil
	}

	return nil, http.StatusBadRequest, fmt.Errorf("must provide a quoteID or an array of quoteIDs")
}
