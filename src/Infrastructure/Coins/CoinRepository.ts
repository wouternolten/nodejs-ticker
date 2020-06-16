import {IDatabaseConnection} from "../../../lib/database/IDatabaseConnection";
import {injectable, inject} from "inversify";
import {TYPES} from "../../../types/inversify/types";
import {ICoinRepository} from "../../Domain/Coins/ICoinRepository";
import {ICoin} from "@/Domain/Coins/ICoin";
import "reflect-metadata";
import moment from "moment";
import {Logger} from "../../../lib/utils/logger";
import {NO_CONTENT, NOT_FOUND} from "http-status-codes";

@injectable()
export class CoinRepository implements ICoinRepository {
  private databaseConnection: IDatabaseConnection;
  private logger: Logger;

  constructor(
    @inject(TYPES.MySqlDatabaseConnection) databaseConnection: IDatabaseConnection,
    @inject(TYPES.Logger) logger: Logger,
  ) {
    this.databaseConnection = databaseConnection;
    this.logger = logger;
  }

  retrieveAllCoins(): Promise<ICoin[]> {
    const queryString = `SELECT id, symbol, amount
                         FROM ticker.tic_coins`;

    return this.databaseConnection
      .query(queryString)
      .then(this.convertToCoins.bind(this))
      .catch((error) => {
        this.logger.error('Error retrieving all coins: ', error)
        throw error;
      })
  }

  async storeCoin(coin: ICoin): Promise<ICoin> {
    const query = `INSERT INTO ticker.tic_coins (${coin.id ? 'id, ' : ''}symbol, amount, created_at, updated_at)
                   VALUES (${coin.id ? ':id, ' : ''}:symbol, :amount, :now, :now)
                   ON DUPLICATE KEY UPDATE symbol = :symbol, amount = :amount, updated_at = :now;`;

    this.logger.info(query);
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
      await this.databaseConnection.beginTransaction();
      const newCoin: ICoin = {...coin};
      const result = await this.databaseConnection.execute(query, {...newCoin, now});
      await this.databaseConnection.commit();

      this.logger.info({...newCoin, id: result.insertId});

      return {...newCoin, id: result.insertId} as ICoin;
    } catch (error) {
      await this.databaseConnection.rollback();

      this.logger.error('Failed to store coin: ', error);

      throw error;
    }
  }

  async deleteCoin(coinId: number): Promise<number> {
    const query = `DELETE
                   FROM ticker.tic_coins tic
                   WHERE tic.id = :coinId`;

    try {
      await this.databaseConnection.beginTransaction();
      const { affectedRows } = await this.databaseConnection.execute(query, { coinId });
      await this.databaseConnection.commit();

      if(affectedRows > 0) {
        return Promise.resolve(NO_CONTENT);
      } else {
        return Promise.resolve(NOT_FOUND);
      }
    } catch(error) {
      await this.databaseConnection.rollback();

      this.logger.error('Failed to delete coin: ', error);

      throw error;
    }
  }

  private convertToCoins(databaseResult: { id: string; symbol: string; amount: string }[]): ICoin[] {
    return databaseResult.map((result: { id: string; symbol: string; amount: string }) => ({
      id: parseInt(result.id, 10),
      symbol: result.symbol,
      amount: parseFloat(result.amount),
    }));
  }

}
