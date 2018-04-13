package filesystem

import (
	"fmt"
	"os"
	"path"

	"github.com/chrfrasco/sharing-wall/api/upload"
)

type fileSystem struct{ dir string }

// New creates a new filesystem image storage service
func New(dir string) (upload.Uploader, error) {
	return fileSystem{dir}, nil
}

func (fs fileSystem) GetFilePath(key string) string {
	return fmt.Sprintf("%s.png", key)
}

func (fs fileSystem) PutImage(key string, img []byte) (*string, error) {
	fileName := fs.GetFilePath(key)
	dest := path.Join(fs.dir, fileName)

	f, err := os.Create(dest)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	f.Write(img)

	return &dest, nil
}
