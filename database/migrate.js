/* eslint-disable @typescript-eslint/no-var-requires */
const mysql2 = require("mysql2");
const migration = require("mysql-migrations");
const dotenv = require("dotenv");
const { resolve } = require("path");

dotenv.config({ path: resolve(__dirname, "../.env") });
let password, port;

if(process.env.MIGRATE_INTEGRATION) {
  password = process.env.INTEGRATION_DATABASE_PASSWORD;
} else {
  password = process.env.DATABASE_PASSWORD;
}

const connection = mysql2.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password,
  database: process.env.DATABASE_NAME
});

migration.init(connection, __dirname + "/migrations");
