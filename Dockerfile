FROM node:lts-alpine3.22 AS base
WORKDIR /app
COPY package*.json tsconfig.json ./

FROM base AS deps
RUN npm install

FROM deps AS build
COPY . .
RUN npm run prepare && npm run build

FROM node:lts-alpine3.22 AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts
COPY --from=build /app/dist ./dist

CMD ["npm", "start"]