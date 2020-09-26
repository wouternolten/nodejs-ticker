export interface ISymbolService {
  retrieveAll(): Promise<string[]>;
  retrieveFiltered(filterCurrency: string): Promise<string[]>;
}
