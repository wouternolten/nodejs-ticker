/* eslint-disable @typescript-eslint/no-var-requires */
const mysql2 = require("mysql2");
const migration = require("mysql-migrations");
const dotenv = require("dotenv");
const { resolve } = require("path");

console.info('Booting migrations...');

dotenv.config({ path: resolve(__dirname, "../.env") });
const config = {
  connectionLimit: 10,
  user: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME
}

if(process.env.MIGRATE_ACCEPTANCE) {
  config.host = 'localhost' || process.env.ACCEPTANCE_DATABASE_HOST;
  config.password = process.env.ACCEPTANCE_DATABASE_PASSWORD;
  config.port = process.env.ACCEPTANCE_DATABASE_PORT;
} else {
  config.host = process.env.DATABASE_HOST;
  config.password = process.env.DATABASE_PASSWORD;
}

const connection = mysql2.createPool(config);

try {
  migration.init(connection, __dirname + "/migrations");
} catch(e) {
  console.error('Error while migrating: ', e);
} finally {
  console.info('Done migrating.');
}
