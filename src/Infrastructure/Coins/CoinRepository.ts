import { IDatabaseConnection } from "../../../lib/database/IDatabaseConnection";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/inversify/types";
import { ICoinRepository } from "../../Domain/Coins/ICoinRepository";
import {ICoin} from "@/Domain/Coins/ICoin";
import "reflect-metadata";

@injectable()
export class CoinRepository implements ICoinRepository {
  private databaseConnection: IDatabaseConnection;

  constructor(@inject(TYPES.MySqlDatabaseConnection) databaseConnection: IDatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  retrieveAllCoins(): Promise<ICoin[]> {
    const queryString = `SELECT symbol, amount FROM ticker.tic_coins`;

    return this.databaseConnection
      .query(queryString)
      .then(this.convertToCoins.bind(this))
      .catch((error) => {
        throw error;
      })
  }

  private convertToCoins(databaseResult: {symbol: string; amount: string}[]): ICoin[] {
    console.log('Received from database: ', databaseResult);
    return databaseResult.map((result: { symbol: string; amount: string }) => ({
      symbol: result.symbol,
      amount: parseFloat(result.amount),
    }));
  }
}
