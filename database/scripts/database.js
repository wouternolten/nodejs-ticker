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
  config.host = process.env.ACCEPTANCE_DATABASE_HOST || 'localhost';
  config.password = process.env.ACCEPTANCE_DATABASE_PASSWORD;
} else {
  config.host = process.env.DATABASE_HOST;
  config.password = process.env.DATABASE_PASSWORD;
}

const connection = mysql2.createPool(config);
let directory, wording;

switch(process.env.COMMAND) {
  case 'migrate':
    directory = '/../migrations';
    wording = 'migrating';
    break;
  case 'provision':
    directory = '/../provision';
    wording = 'provisioning';
    break;
  default:
    console.info('Invalid command ' + process.env.COMMAND);
    process.exit();
    break;
}

async function migrate () {
  return new Promise((res) => {
    migration.init(connection, __dirname + directory, (args) => res(args));
  });
}

migrate()
  .then(() => {
    console.info('Done ' + wording);
    process.exit();
  })
  .catch((error) => {
    console.log('Error when ' + wording + '\n', error);
    process.exit();
  });


