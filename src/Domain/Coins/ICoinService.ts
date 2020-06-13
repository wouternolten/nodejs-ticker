import {ICoin} from "@/Domain/Coins/ICoin";

export interface ICoinService {
  retrieveAllCoins(): Promise<ICoin[]>;
  storeCoin(coin: ICoin): Promise<ICoin>;
  deleteCoin(coinId: number): Promise<number>;
}
