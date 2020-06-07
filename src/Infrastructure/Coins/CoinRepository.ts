import { IDatabaseConnection } from "../../../lib/database/IDatabaseConnection";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/inversify/types";
import { ICoinRepository } from "../../Domain/Coins/ICoinRepository";

@injectable()
export class CoinRepository implements ICoinRepository {
  private databaseConnection: IDatabaseConnection;

  constructor(@inject(TYPES.MySqlDatabaseConnection) databaseConnection: IDatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  getMessage(message: string): string {
    return message + " repository ";
  }
}
