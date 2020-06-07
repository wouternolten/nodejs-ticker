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

  commit(options: any): void {
    return this.connection.commit(options);
  }

  beginTransaction(options: any): void {
    return this.connection.beginTransaction(options);
  }

  async query(queryString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(queryString, (err, result) => {
        if (err) reject(err);

        return resolve(result);
      });
    });
  }

  close(): void {
    throw new Error("Method not implemented.");
  }

  rollback(): void {
    throw new Error("Method not implemented.");
  }
}
