import {ISampleDataType} from "./ISampleDataType";

export class NumberType implements ISampleDataType
{
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  getValue(): any {
    return this.value;
  }
}
