import { UsdEurExchangeRate } from "../UsdEurExchangeRate";
import axios, { AxiosStatic } from "axios";

jest.mock("axios");

describe("UsdEurExchangeRateTest", () => {
  let usdEurExchangeRate: UsdEurExchangeRate;
  const mockedAxios: jest.Mocked<AxiosStatic> = axios as jest.Mocked<typeof axios>;
  const OLD_ENV = process.env;

  beforeEach(() => {
    usdEurExchangeRate = new UsdEurExchangeRate();
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.USD_EUR_URL = "https://validurl.io";
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("Should return a valid exchange rate when no errors are thrown", () => {
    const exchangeRate = 0.9;

    mockedAxios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          rates: {
            EUR: exchangeRate,
          },
        },
      })
    );

    expect.assertions(1);

    return usdEurExchangeRate
      .retrieveExchangeRate()
      .then((rate) => expect(rate).toEqual(exchangeRate));
  });

  it("Should forward error from axios", () => {
    mockedAxios.get.mockReturnValueOnce(Promise.reject(new Error("Rejected")));

    expect.assertions(1);

    return usdEurExchangeRate
      .retrieveExchangeRate()
      .catch((error) => expect(error.message).toEqual("Rejected"));
  });

  it("Should throw error if URL value is not set", () => {
    if (process.env.USD_EUR_URL) {
      delete process.env.USD_EUR_URL;
    }

    expect.assertions(1);

    return usdEurExchangeRate
      .retrieveExchangeRate()
      .catch((error) =>
        expect(error.message).toEqual("No url supplied for getting exchange rate USD/EUR")
      );
  });
});
