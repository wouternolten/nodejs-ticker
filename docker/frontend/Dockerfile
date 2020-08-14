# develop stage
FROM vuejs/ci

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY ./docker/frontend/frontend-package.json ./package.json
COPY ./public ./public
COPY ./vue.config.js ./vue.config.js
COPY ./babel.config.js ./babel.config.js
COPY ./resources ./resources
COPY ./.env ./.env
RUN npm install

# start app
CMD ["npm", "start"]
