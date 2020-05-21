export interface IExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: IRateLimit[];
  exchangeFilters: [];
  symbols: IExchangeSymbol[];
}

export interface IRateLimit {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
}

export interface IExchangeSymbol {
  symbol: string;
}
