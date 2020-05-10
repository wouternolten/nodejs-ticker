import {Ticker} from "./Ticker";

export interface RetrieveTickerInterface {
    retrieveTicker(symbol: string): Promise<Ticker>;
}
