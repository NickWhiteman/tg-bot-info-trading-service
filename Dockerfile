FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g forever
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start"]