package upload

// Uploader provides an interface to some image storage service
type Uploader interface {
	PutImage(key string, img []byte) (*string, error)
	GetFilePath(key string) string
}
