package handler

import (
	"bytes"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/chrfrasco/sharing-wall/api/storage"
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
		return h.authResponseHandler(h.deleteQuote)(w, r)
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
	switch {
	case err == sql.ErrNoRows:
		return nil, http.StatusNotFound, fmt.Errorf("could not find quote %s", quoteID)
	case err != nil:
		return handleInternalError(err, "could not retrieve quote")
	}

	if quote.Img == "" {
		_, err := h.generateAndUploadImageForQuote(*quote)
		if err != nil {
			return handleInternalError(err, "could not gen missing image")
		}
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
	cq, err := clientQuoteFromRequest(r)
	if err != nil {
		return nil, http.StatusBadRequest, fmt.Errorf("unable to decode JSON request body: %v", err)
	}

	if valid, reason := cq.validate(); !valid {
		return nil, http.StatusBadRequest, errors.New(reason)
	}

	var q storage.Quote
	for {
		q = cq.toQuote()
		isUnique, err := h.svc.IsQuoteIDUnique(q.QuoteID)
		if err != nil {
			return handleInternalError(err, "could not check quoteID uniqueness")
		}
		if isUnique {
			break
		}
	}

	imgURL, err := h.generateAndUploadImageForQuote(q)
	if err != nil {
		return handleInternalError(err, "could not persist image")
	}
	q.Img = imgURL

	err = h.svc.AddQuote(q)
	if err != nil {
		return handleInternalError(err, "could not add to database")
	}

	return q, http.StatusOK, nil
}

// Using the quote body and name, query the image generation service
// and persist the response to S3. Return value is the URL of the image.
func (h handler) generateAndUploadImageForQuote(q storage.Quote) (string, error) {
	imgReqData := struct {
		Quote   string `json:"quote"`
		Name    string `json:"name"`
		Version int    `json:"backgroundVersion"`
	}{Quote: q.Body, Name: q.Name, Version: q.BackgroundVersion}

	imgReqJSON, err := json.Marshal(imgReqData)
	if err != nil {
		return "", fmt.Errorf("could encode json: %v", err)
	}

	imgResp, err := http.Post(h.imgURL, "application/json", bytes.NewBuffer(imgReqJSON))
	if err != nil {
		return "", fmt.Errorf("could not request image: %v", err)
	}
	defer imgResp.Body.Close()

	imgRespJSON, err := ioutil.ReadAll(imgResp.Body)
	if err != nil {
		return "", fmt.Errorf("could read response body: %v", err)
	}

	var imgResult struct {
		Png string `json:"png"`
	}
	err = json.Unmarshal(imgRespJSON, &imgResult)
	if err != nil {
		return "", fmt.Errorf("could not unmarshal img response: %v", err)
	}

	imgBytes, err := base64.StdEncoding.DecodeString(imgResult.Png)
	if err != nil {
		return "", fmt.Errorf("could not decode response: %v", err)
	}

	err = h.up.Upload(q.QuoteID+".png", imgBytes)
	if err != nil {
		return "", fmt.Errorf("could not upload image: %v", err)
	}

	return fmt.Sprintf("https://s3-ap-southeast-2.amazonaws.com/sharing-wall/%s.png", q.QuoteID), nil
}

// deleteQuote removes a quote from the database. This route should be authenticated.
// TODO: ensure that this route is wrapped in auth
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
			return handleInternalError(err, "could not delete from database")
		}

		return nil, http.StatusOK, nil
	}

	if len(input.QuoteIDs) > 0 {
		for _, qID := range input.QuoteIDs {
			err := h.svc.DeleteQuote(qID)
			if err != nil {
				return handleInternalError(err, "could not delete from database")
			}
		}

		return nil, http.StatusOK, nil
	}

	return nil, http.StatusBadRequest, fmt.Errorf("must provide a quoteID or an array of quoteIDs")
}
