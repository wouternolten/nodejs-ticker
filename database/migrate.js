/* eslint-disable @typescript-eslint/no-var-requires */
const mysql2 = require("mysql2");
const migration = require("mysql-migrations");
const dotenv = require("dotenv");
const { resolve } = require("path");

dotenv.config({ path: resolve(__dirname, "../.env") });

const connection = mysql2.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
});

migration.init(connection, __dirname + "/migrations");
