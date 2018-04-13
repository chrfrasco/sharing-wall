# Two Hundred Women - Sharing Wall

## Running the application

For **development**, first run:
```sh
$ make run # docker-compose up --build
```
Then visit http://localhost:3000 in your browser. 

For testing purposes, the API is available at http://localhost:8080, and the image generation service at http://localhost:5000.

We take advantage of volume mounts to get live reloading in all of the containers while in `development` mode. That is, when you edit any files, the corresponding service will be restarted. Note: this does not mean that the container will restart, just whatever is serving up the code inside the container (e.g. the webpack dev server in `web/`).

**Production** is not ready yet, but can sample what it will be like by running 

```sh
$ make deploy # docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

Production-specific configuration should be placed in `docker-compose.prod.yml`.

## Project structure

```
sharing-wall/
├── api        # Golang API
├── img        # Node image generation service
├── web        # Frontend SPA (ReactJS)
└── db         # Database dockerfile
```
