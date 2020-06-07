import { ICoinController } from "../../Domain/Coins/ICoinController";
import { ICoin } from "../../Domain/Coins/ICoin";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/inversify/types";
import { ICoinService } from "../../Domain/Coins/ICoinService";
import express from 'express';
import {INTERNAL_SERVER_ERROR, NOT_IMPLEMENTED, OK} from "http-status-codes";
import "reflect-metadata";

@injectable()
export class CoinController implements ICoinController {
  private coinService: ICoinService;

  constructor(@inject(TYPES.CoinService) coinService: ICoinService) {
    this.coinService = coinService;
  }

  async get(response: express.Response): Promise<express.Response> {
    try {
      const coins: ICoin[] = await this.coinService.retrieveAllCoins();

      return response.status(OK).json(coins);
    } catch(error) {
      console.log(error);
      return response.status(INTERNAL_SERVER_ERROR).send('Error while retrieving coins. Please check logs.');
    }
  }

  delete(request: express.Request, response: express.Response): Promise<express.Response> {
    return Promise.resolve(response.status(NOT_IMPLEMENTED));
  }

  put(request: express.Request, response: express.Response): Promise<express.Response> {
    return Promise.resolve(response.status(NOT_IMPLEMENTED));
  }

  store(request: express.Request, response: express.Response): Promise<express.Response> {
    return Promise.resolve(response.status(NOT_IMPLEMENTED));
  }

}
