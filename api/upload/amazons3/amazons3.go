package amazons3

import (
	"bytes"
	"fmt"
	"net/http"

	"github.com/chrfrasco/sharing-wall/api/upload"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

// AmazonS3 holds the current session & bucket name
type AmazonS3 struct {
	Bucket  string
	Session *session.Session
}

// New inits a new AmazonS3 instanxe
func New(access, secret, bucket string) (upload.Uploader, error) {
	creds := credentials.NewStaticCredentials(access, secret, "")

	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String("ap-southeast-2"),
		Credentials: creds,
	})
	if err != nil {
		return nil, err
	}

	return AmazonS3{bucket, sess}, nil
}

// Upload performs the file upload to S3
func (as3 AmazonS3) Upload(key string, imgBuff []byte) error {
	size := int64(len(imgBuff))
	_, err := s3.New(as3.Session).PutObject(&s3.PutObjectInput{
		Bucket:               aws.String("sharing-wall"),
		Key:                  aws.String(key),
		ACL:                  aws.String("private"),
		Body:                 bytes.NewReader(imgBuff),
		ContentLength:        aws.Int64(size),
		ContentType:          aws.String(http.DetectContentType(imgBuff)),
		ContentDisposition:   aws.String("attachment"),
		ServerSideEncryption: aws.String("AES256"),
	})
	if err != nil {
		return fmt.Errorf("could not upload: %v", err)
	}

	return nil
}
