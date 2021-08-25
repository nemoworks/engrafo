# jieshixin

# deploy
```bash
# build backend
docker build backend -t enhydrawgc/sddm-backend
# build frontend
cd frontend && npm run build
cd ..
# deploy
docker-compose down
docker-compose up -d
```