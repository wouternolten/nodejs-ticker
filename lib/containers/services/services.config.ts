import {Container} from "inversify";
import {TYPES} from "../../../types/inversify/types";
import {BinanceSymbolService} from "../../../src/Domain/Binance/Symbols/BinanceSymbolService";
import {CoinService} from "../../../src/Domain/Coins/CoinService";

export default function(container: Container): void {
  container.bind<BinanceSymbolService>(TYPES.BinanceSymbolService).to(BinanceSymbolService);
  container.bind<CoinService>(TYPES.CoinService).to(CoinService);
}
