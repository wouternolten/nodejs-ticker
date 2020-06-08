import {IDatabaseConnection} from "../../../lib/database/IDatabaseConnection";
import {injectable, inject} from "inversify";
import {TYPES} from "../../../types/inversify/types";
import {ICoinRepository} from "../../Domain/Coins/ICoinRepository";
import {ICoin} from "@/Domain/Coins/ICoin";
import "reflect-metadata";
import moment from "moment";

@injectable()
export class CoinRepository implements ICoinRepository {
  private databaseConnection: IDatabaseConnection;

  constructor(@inject(TYPES.MySqlDatabaseConnection) databaseConnection: IDatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  retrieveAllCoins(): Promise<ICoin[]> {
    const queryString = `SELECT symbol, amount
                         FROM ticker.tic_coins`;

    return this.databaseConnection
      .query(queryString)
      .then(this.convertToCoins.bind(this))
      .catch((error) => {
        throw error;
      })
  }

  async storeCoin(coin: ICoin): Promise<void> {
    const query = `INSERT INTO ticker.tic_coins (symbol, amount, created_at, updated_at)
                   VALUES (:symbol, :amount, :now, :now);`

    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
      await this.databaseConnection.beginTransaction();
      await this.databaseConnection.execute(query, {...coin, now});
      await this.databaseConnection.commit();
    } catch (error) {
      await this.databaseConnection.rollback();

      console.error('Failed to store coin: ', error);

      throw error;
    }

    return Promise.resolve();
  }

  async deleteCoin(symbolName: string): Promise<void> {
    const query = `DELETE
                   FROM ticker.tic_coins tic
                   WHERE tic.symbol = :symbolName`;

    try {
      await this.databaseConnection.beginTransaction();
      await this.databaseConnection.execute(query, {symbolName});
      await this.databaseConnection.commit();
    } catch(error) {
      await this.databaseConnection.rollback();

      console.error('Failed to delete coin: ', error);

      throw error;
    }

    return Promise.resolve();
  }

  private convertToCoins(databaseResult: { symbol: string; amount: string }[]): ICoin[] {
    return databaseResult.map((result: { symbol: string; amount: string }) => ({
      symbol: result.symbol,
      amount: parseFloat(result.amount),
    }));
  }

}
