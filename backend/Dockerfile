# Verwende offizielle Node-Image
FROM node:23

# Arbeitsverzeichnis innerhalb des Containers
WORKDIR /app

# Nur package.json und lock zuerst kopieren (besseres Caching)
COPY package*.json ./

# Dependencies installieren
RUN npm install

# Restlichen Code kopieren
COPY . .

# TypeScript kompilieren
RUN npx tsc

# Port freigeben (z. B. für Express)
EXPOSE 5000

# Anwendung starten (kompiliertes JS)
CMD ["node", "src/app.js"]
