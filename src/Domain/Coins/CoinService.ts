import { ICoinService } from "./ICoinService";
import { ICoinRepository } from "./ICoinRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/inversify/types";
import {ICoin} from "@/Domain/Coins/ICoin";
import "reflect-metadata";

@injectable()
export class CoinService implements ICoinService {
  private repository: ICoinRepository;

  constructor(@inject(TYPES.CoinRepository) repository: ICoinRepository) {
    this.repository = repository;
  }

  retrieveAllCoins(): Promise<ICoin[]> {
    return this.repository.retrieveAllCoins();
  }

  storeCoin(coin: ICoin): Promise<ICoin> {
    return this.repository.storeCoin(coin);
  }

  deleteCoin(coinId: number): Promise<number> {
    return this.repository.deleteCoin(coinId);
  }
}
