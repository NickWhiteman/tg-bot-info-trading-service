FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g pm2
RUN npm run build
EXPOSE 3002
CMD ["pm2", "start", "build/index.js", "--name", "trading-service", "--watch", "--restart-delay", "1000", "--no-daemon"]