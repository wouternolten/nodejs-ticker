import { IExchangeRate } from "@/Application/Fiat/IExchangeRate";
import axios from "axios";

export class UsdEurExchangeRate implements IExchangeRate {
  retrieveExchangeRate(): Promise<number> {
    if (!process.env.USD_EUR_URL) {
      return Promise.reject(new Error("No url supplied for getting exchange rate USD/EUR"));
    }

    return axios.get(process.env.USD_EUR_URL).then((response) => {
      return response.data.rates.EUR;
    });
  }
}
