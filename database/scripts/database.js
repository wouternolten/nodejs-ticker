/* eslint-disable @typescript-eslint/no-var-requires */
const mysql2 = require('mysql2');
const dotenv = require('dotenv');
const { resolve } = require('path');
const migration = require('mysql-migrations');

console.info('Booting database script...');

dotenv.config({ path: resolve(__dirname, '../../.env') });
const config = {
  connectionLimit: 10,
  user: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME
};

if (process.env.DATABASE === 'acceptance') {
  config.host = 'localhost' || process.env.ACCEPTANCE_DATABASE_HOST;
  config.password = process.env.ACCEPTANCE_DATABASE_PASSWORD;
  config.port = process.env.ACCEPTANCE_DATABASE_PORT;
} else {
  config.host = process.env.DATABASE_HOST;
  config.password = process.env.DATABASE_PASSWORD;
}

const connection = mysql2.createPool(config);

const directory = `/../${process.env.COMMAND}`;
const wording = process.env.COMMAND === 'migrations' ? 'migrating' : 'provisioning';

console.log(process.env.COMMAND);

async function migrate () {
  return new Promise((res) => {
    migration.init(connection, __dirname + directory, (args) => res(args));
  });
}

migrate()
  .then((args) => {
    console.info('Done ' + wording);
    process.exit();
  })
  .catch((error) => {
    console.log('Error when ' + wording + '\n', error);
    process.exit();
  });


