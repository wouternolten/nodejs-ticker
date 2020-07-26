import {Ticker} from "./Ticker";

export interface TickerServiceInterface {
    retrieveTicker(symbol: string): Promise<Ticker>;
}
