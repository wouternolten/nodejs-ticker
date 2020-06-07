import {ICoin} from "@/Domain/Coins/ICoin";

export interface ICoinRepository {
  retrieveAllCoins(): Promise<ICoin[]>;
  storeCoin(coin: ICoin): Promise<void>;
}
