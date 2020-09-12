/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDatabaseConnection } from "../IDatabaseConnection";
import { Connection, ConnectionOptions, createConnection, QueryOptions } from "mysql2";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class MySqlDatabaseConnection implements IDatabaseConnection {
  private connection: Connection;

  constructor(
    password = process.env.DATABASE_PASSWORD,
  ) {
    const config: ConnectionOptions = {
      host: process.env.DATABASE_HOST || "",
      user: process.env.DATABASE_USERNAME || "",
      password: password || "",
      database: process.env.DATABASE_NAME,
      namedPlaceholders: true,
    };

    if(process.env.DATABASE_PORT) {
      config.port = parseInt(process.env.DATABASE_PORT, 10);
    }

    this.connection = createConnection(config);
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
      this.connection.execute(queryString, parameters, (error, result) => {
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
