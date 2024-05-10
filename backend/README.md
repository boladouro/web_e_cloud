# Backend

## Setup
```
winget install prefix-dev.pixi
echo "MONGODB_CONECTION_STRING=mongodb://localhost:27017" > .env # or any other connection string
pixi run setup-db
```

## Run
```
pixi run start
```