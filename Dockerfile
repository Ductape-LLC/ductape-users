FROM node:20-alpine AS BUILD_IMAGE

# Work Directory
WORKDIR /usr/src/app

COPY package*.json ./

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install Dependencies
RUN npm i

COPY . .

# compile application
RUN npm run build

# remove development dependencies
RUN npm prune --omit-dev

# ------------------------ SECOND IMAGE ------------------------

FROM node:20-alpine

# Work Directory
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app .
ENV ext=js


EXPOSE 3000

CMD [ "npm", "start" ]