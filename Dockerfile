# Use a imagem oficial do Node.js
FROM node:18-alpine

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Expor a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
