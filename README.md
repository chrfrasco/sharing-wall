# Two Hundred Women - Sharing Wall

## Running the application

For **development**, first run:
```sh
$ make run # docker-compose up --build
```
Then visit http://localhost:3000 in your browser. The API is also available at http://localhost:8080.

This takes advantage of volume mounts to get live reloading in both the api and web containers. That is, when you edit any `.go` files in `api/`, the server will be restarted. Same for any files in `web/`.

**Production** is not ready yet, but can sample what it will be like by running 

```sh
$ make deploy # docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

Production-specific configuration should be placed in `docker-compose.prod.yml`.

## Project structure

```
sharing-wall/
├── api        # Golang API
├── web        # Frontend SPA (ReactJS)
└── db         # Database dockerfile
```