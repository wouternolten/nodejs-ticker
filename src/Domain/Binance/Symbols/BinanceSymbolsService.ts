import { ISymbols } from "@/Application/Symbol/ISymbols";
import axios from "axios";
import { IExchangeSymbol } from "@/Application/Exchange/IExchangeInfo";

export class BinanceSymbolsService implements ISymbols {
  private symbols: string[] = [];
  public async retrieveAll(): Promise<string[]> {
    if(this.symbols.length === 0) {
      this.symbols = await axios
        .get(`${process.env.BINANCE_BASE_URL}/api/v3/exchangeInfo`)
        .then((response) => this.mapSymbolsFromResponse(response.data.symbols))
        .then((symbols) => symbols.sort());
    }

    return Promise.resolve(this.symbols);
  }

  private mapSymbolsFromResponse(binanceSymbols: IExchangeSymbol[]): Promise<string[]> {
    return Promise.all(
      binanceSymbols.map(async (binanceSymbol: IExchangeSymbol) => binanceSymbol.symbol)
    );
  }
}
