import { ICoinController } from "../../Domain/Coins/ICoinController";
import { ICoin } from "../../Domain/Coins/ICoin";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/inversify/types";
import { ICoinService } from "../../Domain/Coins/ICoinService";
import express from 'express';
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_IMPLEMENTED,
  OK
} from "http-status-codes";
import "reflect-metadata";
import { validate } from "../../../lib/utils/validate";
import storeCoinSchema from "../../../schemas/coins/storeCoinSchema.json";
import deleteCoinSchema from "../../../schemas/coins/deleteCoinSchema.json";
import {Logger} from "../../../lib/utils/logger";

@injectable()
export class CoinController implements ICoinController {
  private coinService: ICoinService;
  private logger: Logger;

  constructor(
    @inject(TYPES.CoinService) coinService: ICoinService,
    @inject(TYPES.Logger) logger: Logger
  ) {
    this.coinService = coinService;
    this.logger = logger;
  }

  async get(response: express.Response): Promise<express.Response> {
    try {
      const coins: ICoin[] = await this.coinService.retrieveAllCoins();

      return response.status(OK).json(coins);
    } catch(error) {
      this.logger.error(error);
      return response.status(INTERNAL_SERVER_ERROR).send('Error while retrieving coins. Please check logs.');
    }
  }

  delete(request: express.Request, response: express.Response): Promise<express.Response> {
    try {
      validate(request, deleteCoinSchema);
    } catch (error) {
      this.logger.error(error);
      return Promise.resolve(response.status(BAD_REQUEST).send('Bad request.'));
    }

    return this.coinService.deleteCoin(request.body.id as number)
      .then((responseStatus) => response.status(responseStatus).send(`Deleted ${request.body} from coins`))
      .catch(() => response.status(INTERNAL_SERVER_ERROR).send(`Error while trying to delete coin. Please check logs.`));
  }

  store(request: express.Request, response: express.Response): Promise<express.Response> {
    try {
      validate(request, storeCoinSchema);
    } catch (error) {
      this.logger.error('Bad request for POST', error);
      return Promise.resolve(response.status(BAD_REQUEST).send('Bad request.'));
    }

    return this.coinService.storeCoin(request.body as ICoin)
      .then((storedCoin: ICoin) => response.status(CREATED).json(storedCoin))
      .catch(() => response.status(INTERNAL_SERVER_ERROR).send(`Error while trying to store coin. Please check logs.`));
  }

}

