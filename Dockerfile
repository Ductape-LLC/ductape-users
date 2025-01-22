FROM node:20-alpine AS BUILD_IMAGE

# Work Directory
WORKDIR /usr/src/app

COPY package*.json ./

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install Python, make, gcc, musl-dev, expat-dev, and libxml2-dev
RUN apk add --no-cache python3 make gcc musl-dev expat-dev libxml2-dev g++
ENV PYTHON=/usr/bin/python3

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