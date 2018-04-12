# sharing-wall-img-create
Image generation service for https://github.com/chrfrasco/sharing-wall

> *Will eventually be merged into the main repo*

## Usage

To start, simply run `docker-compose up`. The service will be available on http://localhost:5000.

To generate an image, you can either send a `POST` request to the root with a JSON body, e.g.

```json
{
  "name": "Abraham Lincoln",
  "quote": "Whatever you are, be a good one."
}
```

Or send a GET request with the name and quote in URL params, e.g. `GET /?name=Abraham%20Lincoln&quote=Whatever%20you%20are,%20be%20a%20good%20one`.

Currently, the image is saved to disc rather than to a storage service like S3. Eventually this will change, but the API will stay the same.
