FROM node:16

# create the app and node modules folder with the right permissions to allow future npm install
RUN mkdir -p /home/app/node_modules && chown -R node:node /home/app
WORKDIR /home/app
# copy the package.json file before the rest of the code to take advantage of Docker layer caching
COPY package*.json ./
# Switch user to node to ensure that all application files are owned by none root user node
USER node
RUN yarn install
# copy the rest of the application files and set the right user permissions
COPY --chown=node:node . .
# build application in the current working directory
RUN yarn build
EXPOSE 8080
CMD [ "sh", "-c", "yarn start:prod"]