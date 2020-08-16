# develop stage
FROM lambci/lambda:build-nodejs12.x

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY ./docker/backend/backend-package.json ./package.json
RUN npm install --no-progress --loglevel=error

EXPOSE 3000

# start app
CMD ["npm", "run", "start-backend"]
