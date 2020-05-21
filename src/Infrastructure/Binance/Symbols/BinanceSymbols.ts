import { ISymbols } from "@/Application/Symbol/ISymbols";
import axios from "axios";
import { IExchangeSymbol } from "@/Application/Exchange/IExchangeInfo";

export class BinanceSymbols implements ISymbols {
  public async retrieveAll(): Promise<string[]> {
    return axios
      .get(`${process.env.BINANCE_BASE_URL}/api/v3/exchangeInfo`)
      .then((response) => this.mapSymbolsFromResponse(response.data.symbols))
      .then(this.sortSymbols);
  }

  private mapSymbolsFromResponse(binanceSymbols: IExchangeSymbol[]): Promise<string[]> {
    return Promise.all(
      binanceSymbols.map(async (binanceSymbol: IExchangeSymbol) => binanceSymbol.symbol)
    );
  }

  private sortSymbols(symbols: string[]): string[] {
    return symbols.sort();
  }
}
