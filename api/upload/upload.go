package upload

// Uploader provides an interface to some image storage service
type Uploader interface {
	Upload(key string, imgBuff []byte) error
}
