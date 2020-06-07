import {ICoin} from "@/Domain/Coins/ICoin";

export interface ICoinRepository {
  retrieveAllCoins(): Promise<ICoin[]>;
}
