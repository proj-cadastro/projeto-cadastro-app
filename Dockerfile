# Usando a imagem do Node.js
FROM node:18

# Definindo o diretório de trabalho dentro do container
WORKDIR /app

# Copiando os arquivos do front-end para o container
COPY . .

# Instalando as dependências
RUN npm install --legacy-peer-deps

# Expondo a porta do front-end (ajuste conforme necessário)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
