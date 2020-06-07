import { ICoin } from "./ICoin";

export interface ICoinController {
  get(): Promise<ICoin[]>;
  store(request: Request): Promise<ICoin>;
  put(id: number, coin: ICoin): Promise<void>;
  delete(id: number): Promise<void>;
}
