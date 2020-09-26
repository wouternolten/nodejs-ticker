import "reflect-metadata";
import { BinanceSymbolService } from "../BinanceSymbolService";
import { AxiosStatic } from "axios";
import axios from "axios";

jest.mock("axios");

let binanceSymbols: BinanceSymbolService;
const mockedAxios: jest.Mocked<AxiosStatic> = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  binanceSymbols = new BinanceSymbolService();
});

describe("BinanceSymbolsTest", () => {
  describe("Retrieve all symbols", () => {
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

      return binanceSymbols.retrieveAll().then((retrievedSymbols: string[]) => {
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

  describe("Retrieve filtered symbols", () => {
    it('Should filter based on the currency given', (done) => {
      const symbols: string[] = ["ETHBTC", "LTCBTC", "BTCUSDT", "USDTAUG"];

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

      return binanceSymbols.retrieveFiltered("USDT").then((retrievedSymbols: string[]) => {
        expect(retrievedSymbols).toStrictEqual([symbols[2]]);
        done();
      });
    });
  });
});

