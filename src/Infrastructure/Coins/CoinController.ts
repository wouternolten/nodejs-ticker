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

    // TODO: BUILD LOGGER
    this.logger.log(`Deleting coin ${ request.body.symbol }`);

    return this.coinService.deleteCoin(request.body.symbol as string)
      .then(() => response.status(NO_CONTENT).send(`Deleted ${request.body} from coins`))
      .catch(() => response.status(INTERNAL_SERVER_ERROR).send(`Error while trying to delete coin. Please check logs.`));
  }

  put(request: express.Request, response: express.Response): Promise<express.Response> {
    return Promise.resolve(response.status(NOT_IMPLEMENTED));
  }

  store(request: express.Request, response: express.Response): Promise<express.Response> {
    try {
      validate(request, storeCoinSchema);
    } catch (error) {
      this.logger.error(error);
      return Promise.resolve(response.status(BAD_REQUEST).send('Bad request.'));
    }

    return this.coinService.storeCoin(request.body as ICoin)
      .then(() => response.status(CREATED).send(`Successfully stored ${request.body.symbol}`))
      .catch(() => response.status(INTERNAL_SERVER_ERROR).send(`Error while trying to store coin. Please check logs.`));
  }

}

