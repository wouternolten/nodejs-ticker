/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDatabaseConnection {
  commit(): Promise<void>;
  beginTransaction(): Promise<void>;
  query(queryString: string): Promise<any>;
  rollback(): Promise<void>;
  execute(queryString: string, parameters: any): Promise<any>;
  end(): Promise<void>;
}
