import "reflect-metadata";
import { ISymbolService } from "@/Application/Symbol/ISymbolService";
import axios from "axios";
import { IExchangeSymbol } from "@/Application/Exchange/IExchangeInfo";
import {injectable} from "inversify";

@injectable()
export class BinanceSymbolService implements ISymbolService {
  private symbols: string[] = [];
  private filteredSymbols: string[] = [];
  public async retrieveAll(): Promise<string[]> {
    if(this.symbols.length === 0) {
      this.symbols = await axios
        .get(`${process.env.BINANCE_BASE_URL}/api/v3/exchangeInfo`)
        .then((response) => this.mapSymbolsFromResponse(response.data.symbols))
        .then((symbols) => symbols.sort());
    }

    return Promise.resolve(this.symbols);
  }

  public async retrieveFiltered(filterCurrency: string): Promise<string[]> {
    if (this.filteredSymbols.length === 0) {
      this.filteredSymbols = await axios
        .get(`${process.env.BINANCE_BASE_URL}/api/v3/exchangeInfo`)
        .then((response) => this.mapSymbolsFromResponse(response.data.symbols))
        .then((symbols) => symbols
            .filter((symbol: string) => symbol.toUpperCase().indexOf(filterCurrency.toUpperCase()) > 0)
            .sort()
        );
    }
    return Promise.resolve(this.filteredSymbols);
  }

  private mapSymbolsFromResponse(binanceSymbols: IExchangeSymbol[]): Promise<string[]> {
    return Promise.all(
      binanceSymbols.map(async (binanceSymbol: IExchangeSymbol) => binanceSymbol.symbol)
    );
  }
}
