# backend for engrafo project
based on expressjs, postgresql and swagger-ui

### file structure
├── bin #build output
├── data-structure #some datastructure definition & related algs
├── database #docker-compose config & init script
├── node_modules #deps
├── public #assets & stylesheets
├── routes #api
├── swagger-ui #api doc
└── views #backend pages

### run
run project(api doc at /swagger-ui)
```bash
npm install
npm run start
```

run postgresql
```bash
cd database
docker-compose up -d
```
