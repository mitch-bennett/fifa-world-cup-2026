# Stage 1: build the React/Vite static site
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Optional: Geoapify key for English-labeled map tiles. Passed as a build arg
# (compose forwards it from the host env); Vite bakes VITE_* vars in at build.
ARG VITE_GEOAPIFY_KEY=""
ENV VITE_GEOAPIFY_KEY=$VITE_GEOAPIFY_KEY
RUN npm run build

# Stage 2: serve the static files with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
