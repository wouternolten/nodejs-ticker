import {ISampleDataType} from "./ISampleDataType";

export class DateType implements ISampleDataType
{
  private readonly value: Date;

  constructor(value: Date) {
    this.value = value;
  }

  getValue(): any {
    const year = this.value.getUTCFullYear();
    const month = DateType.prefixWithZero(this.value.getUTCMonth());
    const day = DateType.prefixWithZero(this.value.getUTCDay());

    const hour = DateType.prefixWithZero(this.value.getUTCHours());
    const minute = DateType.prefixWithZero(this.value.getUTCMinutes());
    const second = DateType.prefixWithZero(this.value.getUTCSeconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  private static prefixWithZero(value: number, length = 2): string {
    let stringValue = `${value}`;
    if(stringValue.length === length) {
      return stringValue;
    }

    while(stringValue.length < length) {
      stringValue = '0' + stringValue;
    }

    return stringValue;
  }
}
