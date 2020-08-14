# develop stage
FROM vuejs/ci

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY ./database ./database
COPY ./etc ./etc
COPY ./lib ./lib
COPY ./schemas ./schemas
COPY ./src ./src
COPY ./types ./types
COPY ./docker/backend/backend-package.json ./package.json
COPY ./babel.config.js ./babel.config.js
COPY ./tsconfig.json ./tsconfig.json
COPY ./tslint.json ./tslint.json
COPY ./index.ts ./index.ts
COPY ./.env ./.env
RUN npm install --no-progress

# start app
CMD ["npm", "start"]
