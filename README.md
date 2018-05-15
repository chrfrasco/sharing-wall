# Two Hundred Women - Sharing Wall

## Running the application

For **development**, first run:
```sh
$ docker-compose up # add --build to trigger a rebuild
```
Then visit http://localhost:3000 in your browser. 

For testing purposes, the API is available at http://localhost:8080, and the image generation service at http://localhost:5000.

We take advantage of volume mounts to get live reloading in all of the containers while in `development` mode. That is, when you edit any files, the corresponding service will be restarted. Note: this does not mean that the container will restart, just whatever is serving up the code inside the container (e.g. the webpack dev server in `web/`).

## Deploying the application

For **Production** deploys, we use Heroku and git subtrees. For convenience, the git commands are in the Makefile. Each of the services can be deployed by running `make deploy-<svc>`, e.g. `make deploy-img`. To enable these commands, you'll need to add the git remotes and alias them (e.g. for web):

```sh
$ heroku git:remote --app sharing-wall-web # adds the heroku git url to remotes
$ git remote rename heroku heroku-sharing-wall-img
```

Make sure that all environmental variables listed in `api/.env.example` are set in the admin interface for sharing-wall-api.

## Project structure
```
sharing-wall/
├── api        # Golang API
├── img        # Node image generation service
├── web        # Frontend SPA (ReactJS)
└── db         # Database dockerfile
```

## Common problems

- **New npm dependencies aren't showing up**: `node_modules` is ignored by docker, and populated during the build step. You'll need to run `$ docker-compose up --build` to install the new packages.
