# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# --- START DEBUGGING-LINJE ---
# Skriv ut alle VITE-variabler for å se hva bygge-miljøet mottar
RUN echo "--- DEBUG: Printing VITE environment variables ---" && printenv | grep VITE_
# --- SLUTT DEBUGGING-LINJE ---

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"