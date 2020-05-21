import { BinanceSymbols } from "./BinanceSymbols";
import { AxiosStatic } from "axios";
import axios from "axios";

jest.mock("axios");

describe("RetrieveSymbolsTest", () => {
  let binanceSymbols: BinanceSymbols;
  const mockedAxios: jest.Mocked<AxiosStatic> = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    binanceSymbols = new BinanceSymbols();
  });

  it("Should retrieve and map all symbols to alphabetically sorted string if Binance gives a valid response", (done) => {
    const symbols: string[] = ["ETHBTC", "LTCBTC", "BTCUSDT"];

    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          symbols: [
            {
              symbol: symbols[0],
            },
            {
              symbol: symbols[1],
            },
            {
              symbol: symbols[2],
            },
          ],
        },
      })
    );

    expect.assertions(1);

    return binanceSymbols.retrieveAll().then((retrievedSymbols) => {
      expect(retrievedSymbols).toStrictEqual(symbols.sort());
      done();
    });
  });

  it("Should throw an error when Binance throws an error", async (done) => {
    mockedAxios.get.mockReturnValueOnce(Promise.reject(new Error("Error from binance")));

    expect.assertions(2);

    try {
      await binanceSymbols.retrieveAll();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual("Error from binance");
      done();
    }
  });
});
