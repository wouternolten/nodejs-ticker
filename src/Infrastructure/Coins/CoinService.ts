import { ICoinService } from "../../Domain/Coins/ICoinService";
import { ICoinRepository } from "../../Domain/Coins/ICoinRepository";
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
}
