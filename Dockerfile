FROM node:20-alpine AS build-stage

WORKDIR .

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build-only

# production stage
FROM nginx AS production-stage

COPY --from=build-stage ./dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
