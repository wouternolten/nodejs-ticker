/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDatabaseConnection } from "../IDatabaseConnection";
import mysql2 from "mysql2";
import { injectable } from "inversify";

@injectable()
export class MySqlDatabaseConnection implements IDatabaseConnection {
  private connection: mysql2.Connection;

  constructor() {
    const config: mysql2.ConnectionOptions = {
      host: process.env.DATABASE_HOST || "",
      user: process.env.DATABASE_USERNAME || "",
      password: process.env.DATABASE_PASSWORD || "",
      port: parseInt(process.env.DATABASE_PORT || "3306", 10),
      database: process.env.DATABASE_NAME,
    };

    this.connection = mysql2.createConnection(config);
  }

  commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.commit((error) => {
        if(error) reject(error);

        return resolve();
      })
    });
  }

  beginTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction((error) => {
        if(error) reject(error);

        return resolve();
      })
    });
  }

  async query(queryString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(queryString, (err, result) => {
        if (err) reject(err);

        return resolve(result);
      });
    });
  }

  async execute(queryString: string, parameters: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.execute({ sql: queryString, namedPlaceholders: true } as mysql2.QueryOptions, parameters, (error, result) => {
        if (error) reject(error);

        return resolve(result);
      });
    });
  }

  close(): void{
    this.connection.destroy();
  }

  rollback(): Promise<void> {
    return new Promise((resolve) => {
      this.connection.rollback(() => {
        return resolve();
      })
    });
  }
}
