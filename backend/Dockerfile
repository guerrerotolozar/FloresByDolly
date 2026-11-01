FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
