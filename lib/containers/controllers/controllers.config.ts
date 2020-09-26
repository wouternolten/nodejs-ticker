import {Container} from "inversify";
import {CoinController} from "../../../src/Infrastructure/Coins/CoinController";
import {TYPES} from "../../../types/inversify/types";
import {SymbolController} from "../../../src/Infrastructure/Symbols/SymbolController";

export default function(container: Container): void {
  container.bind<CoinController>(TYPES.CoinController).to(CoinController);
  container.bind<SymbolController>(TYPES.SymbolController).to(SymbolController);
}
