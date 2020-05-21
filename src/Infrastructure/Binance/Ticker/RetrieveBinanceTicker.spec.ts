import { RetrieveBinanceTicker } from "./RetrieveBinanceTicker";
import { InvalidSymbolException } from "../../../Application/Exceptions/InvalidSymbolException";
import axios, { AxiosStatic } from "axios";
import { Ticker } from "../../../Application/Ticker/Ticker";
import HttpStatus from "http-status-codes";
import { IllegalCharacterException } from "../../../Application/Exceptions/IllegalCharacterException";
import { UrlNotFoundException } from "../../../Application/Exceptions/UrlNotFoundException";

jest.mock("axios");

describe("retrieveTicker test", () => {
  let retrieveBinanceTicker: RetrieveBinanceTicker;
  const mockedAxios: jest.Mocked<AxiosStatic> = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    retrieveBinanceTicker = new RetrieveBinanceTicker("");
  });

  it("Should throw an error when an invalid symbol is used", async () => {
    expect.assertions(1);

    mockedAxios.get.mockReturnValueOnce(
      Promise.reject({
        response: {
          status: HttpStatus.BAD_REQUEST,
          data: {
            code: -1121,
            msg: "Invalid symbol.",
          },
        },
      })
    );

    return retrieveBinanceTicker
      .retrieveTicker("INVALIDSYMBOL")
      .catch((e) => expect(e).toBeInstanceOf(InvalidSymbolException));
  });

  it("Should throw an error when an invalid charachter is used", async () => {
    expect.assertions(1);

    mockedAxios.get.mockReturnValueOnce(
      Promise.reject({
        response: {
          status: HttpStatus.BAD_REQUEST,
          data: {
            code: -1100,
            msg: "Illegal characters used.",
          },
        },
      })
    );

    return retrieveBinanceTicker
      .retrieveTicker("INVALIDSYMBOL14!@#")
      .catch((e) => expect(e).toBeInstanceOf(IllegalCharacterException));
  });

  it("Should throw an error when an url is not found", async () => {
    expect.assertions(1);

    mockedAxios.get.mockReturnValueOnce(
      Promise.reject({
        response: {
          status: HttpStatus.NOT_FOUND,
        },
      })
    );

    return retrieveBinanceTicker
      .retrieveTicker("")
      .catch((e) => expect(e).toBeInstanceOf(UrlNotFoundException));
  });

  it("Should give back a valid ticker when url is successfully called and valid symbol is used", async (done) => {
    const expectedTicker: Ticker = { symbol: "BTCUSDT", price: 100000 };

    mockedAxios.get.mockResolvedValue({
      data: {
        symbol: "BTCUSDT",
        price: "100000.000",
      },
    });

    return retrieveBinanceTicker.retrieveTicker("BTCUSDT").then((ticker: Ticker) => {
      expect(ticker.price).toEqual(expectedTicker.price);
      expect(ticker.symbol).toEqual(expectedTicker.symbol);
      done();
    });
  });
});
