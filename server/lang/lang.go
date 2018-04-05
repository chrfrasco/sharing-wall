package lang

import (
	"fmt"
	"net/http"

	"golang.org/x/text/language"
)

var matcher = language.NewMatcher([]language.Tag{
	language.English,
	language.German,
})

func FromRequest(r *http.Request) language.Tag {
	lang, _ := r.Cookie("lang")
	fmt.Printf("lang: '%s'\n", lang.String())
	accept := r.Header.Get("Accept-Language")
	tag, _ := language.MatchStrings(matcher, lang.String(), accept)
	return tag
}
