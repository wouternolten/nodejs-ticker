export interface IDatabaseConnection {
  commit(options: any): void;
  beginTransaction(options: any): void;
  query(queryString: string): Promise<any>;
  close(): void;
  rollback(): void;
}
