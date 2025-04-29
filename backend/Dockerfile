# Base image
FROM node:20

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie tous les fichiers dans le conteneur
COPY . .

# Installe les dépendances
RUN npm install

# Port exposé (optionnel mais utile pour documentation)
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
