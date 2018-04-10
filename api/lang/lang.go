package lang

import (
	"net/http"

	"golang.org/x/text/language"
)

var matcher = language.NewMatcher([]language.Tag{
	language.English,
	language.German,
})

// FromRequest chooses the most appropriate language tag based on
// the "lang" cookie and "Accept-Language" header
func FromRequest(r *http.Request) language.Tag {
	lang, _ := r.Cookie("lang")
	accept := r.Header.Get("Accept-Language")
	tag, _ := language.MatchStrings(matcher, lang.String(), accept)
	return tag
}
