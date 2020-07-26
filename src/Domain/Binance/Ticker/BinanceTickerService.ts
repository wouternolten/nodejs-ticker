import { TickerServiceInterface } from "../../../Application/Ticker/TickerServiceInterface";
import { Ticker } from "../../../Application/Ticker/Ticker";
import { InvalidSymbolException } from "../../../Application/Exceptions/InvalidSymbolException";
import axios, { AxiosResponse } from "axios";
import HttpStatus from "http-status-codes";
import { IllegalCharacterException } from "../../../Application/Exceptions/IllegalCharacterException";
import { UrlNotFoundException } from "../../../Application/Exceptions/UrlNotFoundException";

export class BinanceTickerService implements TickerServiceInterface {
  private readonly INVALID_SYMBOL = -1121;
  private readonly ILLEGAL_CHARACTER = -1100;
  private tickerUrl: string;

  constructor(tickerUrl: string) {
    this.tickerUrl = tickerUrl;
  }

  async retrieveTicker(symbol: string): Promise<Ticker> {
    const fullUrl = this.tickerUrl + "price?symbol=" + symbol;
    return axios
      .get(fullUrl)
      .then((response: AxiosResponse) => ({
        symbol: response.data.symbol,
        price: parseFloat(response.data.price),
      }))
      .catch((error) => {
        const { status } = error.response;

        if (status === HttpStatus.BAD_REQUEST) {
          const { data } = error.response;

          if (data.code === this.INVALID_SYMBOL) {
            throw new InvalidSymbolException(symbol);
          }

          if (data.code === this.ILLEGAL_CHARACTER) {
            throw new IllegalCharacterException(symbol);
          }
        }

        if (status === HttpStatus.NOT_FOUND) {
          throw new UrlNotFoundException(fullUrl);
        }

        throw error;
      });
  }
}
