# develop stage
FROM vuejs/ci

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY ./docker/frontend/frontend-package.json ./package.json
RUN npm install --no-progress --loglevel=error

EXPOSE 8080

# start app
CMD ["npm", "run", "start-frontend"]
