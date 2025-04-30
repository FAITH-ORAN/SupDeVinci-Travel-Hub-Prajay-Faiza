# SupDeVinci-Travel-Hub-Prajay-Faiza

Application polyglotte utilisant trois bases de données NoSQL (MongoDB, RedisDB, Neo4J). Cette application permet de gérer des offres de voyage.

## Cloner le repository

Commencez par cloner ce repository sur votre machine locale :

- git clone https://github.com/FAITH-ORAN/SupDeVinci-Travel-Hub-Prajay-Faiza.git
- cd SupDeVinci-Travel-Hub-Prajay-Faiza

## Prérequis

- [Docker](https://www.docker.com/) installé sur votre machine.

## Démarrage avec Docker Compose

1. Allez dans le dossier `backend` :

   - cd backend

2. Lancez l'application avec Docker Compose :
   docker-compose up --build

Vous devrez voir dans le terminal :

✅ Connected to MongoDB Atlas  
✅ Connected to Redis Cloud  
✅ Connected to Neo4J  
✅ Server running on http://localhost:3000

2. Une fois le conteneur démarré, l'API backend sera disponible à l'adresse suivante :
   http://localhost:3000

## Documentation de l'API

La documentation complète de l'API est disponible sur Postman :  
[Documentation API Postman](https://documenter.getpostman.com/view/17140582/2sB2j3CsHx#intro)
