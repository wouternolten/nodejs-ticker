/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDatabaseConnection {
  commit(): Promise<void>;
  beginTransaction(): Promise<void>;
  query(queryString: string): Promise<any>;
  close(): void;
  rollback(): Promise<void>;
  execute(queryString: string, parameters: any): Promise<any>;
}
