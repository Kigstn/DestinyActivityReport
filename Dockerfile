FROM node:lts-alpine AS build-stage

WORKDIR .

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build-only

# production stage
FROM nginx:stable-alpine AS production-stage

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage ./dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
