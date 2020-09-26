import "reflect-metadata";
import {ISymbolController} from "@/Domain/Binance/Symbols/ISymbolController";
import express from 'express';
import {inject, injectable} from "inversify";
import {ISymbolService} from "../../Application/Symbol/ISymbolService";
import {TYPES} from "../../../types/inversify/types";
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, OK} from "http-status-codes";

@injectable()
export class SymbolController implements ISymbolController {
  @inject(TYPES.BinanceSymbolService) private symbolService: ISymbolService;

  constructor(@inject(TYPES.BinanceSymbolService) symbolService: ISymbolService) {
    this.symbolService = symbolService;
  }

  async get(request: express.Request, response: express.Response): Promise<express.Response> {
    let coins;

    if(!request.query.currency) {
      try {
        coins = await this.symbolService.retrieveAll();
      } catch (error) {
        return response.status(INTERNAL_SERVER_ERROR);
      }
    } else {
      const currency = request.query.currency as string;

      // Only accept uppercase alphabetic characters
      if(!/^[A-Z]*$/.test(currency)) {
        return response.status(BAD_REQUEST);
      }

      try {
        coins = await this.symbolService.retrieveFiltered(currency);
      } catch (error) {
        return response.status(INTERNAL_SERVER_ERROR);
      }
    }

    return response.status(OK).send(coins);
  }
}
