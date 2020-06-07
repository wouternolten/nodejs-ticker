import { ICoinController } from "../../Domain/Coins/ICoinController";
import { ICoin } from "../../Domain/Coins/ICoin";
import * as core from "express-serve-static-core";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/inversify/types";
import { ICoinService } from "../../Domain/Coins/ICoinService";

@injectable()
export class CoinController implements ICoinController {
  private coinService: ICoinService;

  constructor(@inject(TYPES.CoinService) coinService: ICoinService) {
    this.coinService = coinService;
  }

  get(): Promise<ICoin[]> {
    throw new Error("Controller" + this.coinService.getMessage(""));
  }
  store(request: core.Request<core.ParamsDictionary>): Promise<ICoin> {
    throw new Error("Method not implemented.");
  }
  put(id: number, coin: ICoin): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
