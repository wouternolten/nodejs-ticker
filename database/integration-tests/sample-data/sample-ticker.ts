import { IDatabaseSampleData } from "../helpers/IDatabaseSampleData";
import {StringType} from "../helpers/StringType";
import {NumberType} from "../helpers/NumberType";
import {DateType} from "../helpers/DateType";

export function getSampleData(): IDatabaseSampleData[] {
  return [
    {
      table: "tic_coins",
      data: [
        {
          "symbol": new StringType("BTC"),
          "amount": new NumberType(Math.random().toFixed(7)),
          "created_at": new DateType(new Date()),
          "updated_at": new DateType(new Date()),
        },
        {
          "symbol": new StringType("ETH"),
          "amount": new NumberType((Math.round(Math.random() * 300) / 100).toFixed(7)),
          "created_at": new DateType(new Date()),
          "updated_at": new DateType(new Date())
        },
        {
          "symbol": new StringType("XRP"),
          "amount": new NumberType((Math.random() * 10000).toFixed(5)),
          "created_at": new DateType(new Date()),
          "updated_at": new DateType(new Date())
        }
      ]
    }
  ]
}
