import { ICoinService } from "../../Domain/Coins/ICoinService";
import { ICoinRepository } from "../../Domain/Coins/ICoinRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/inversify/types";

@injectable()
export class CoinService implements ICoinService {
  private repository: ICoinRepository;

  constructor(@inject(TYPES.CoinRepository) repository: ICoinRepository) {
    this.repository = repository;
  }

  getMessage(message: string): string {
    return message + " service " + this.repository.getMessage(message);
  }
}
