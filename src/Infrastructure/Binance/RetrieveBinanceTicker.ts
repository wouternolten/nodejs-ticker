import {RetrieveTickerInterface} from "../../Application/Ticker/RetrieveTickerInterface";
import {Ticker} from "../../Application/Ticker/Ticker";
import {InvalidSymbolException} from "../../Application/Ticker/InvalidSymbolException";

export class RetrieveBinanceTicker implements RetrieveTickerInterface {
    private tickerUrl;

    constructor(tickerUrl: string) {
        this.tickerUrl = tickerUrl;
    }

    retrieveTicker(symbol: string): Promise<Ticker> {
        throw new InvalidSymbolException(symbol);
    }
}
