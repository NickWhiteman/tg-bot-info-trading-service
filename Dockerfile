FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g forever
EXPOSE 5000
CMD ["forever", "start", "build/index.js"]