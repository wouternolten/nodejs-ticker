import {ICoin} from "@/Domain/Coins/ICoin";

export interface ICoinService {
  retrieveAllCoins(): Promise<ICoin[]>;
}
