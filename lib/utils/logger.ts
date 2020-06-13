/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";

@injectable()
export class Logger {
  public error(...logs: any): void {
    return console.error(Logger.writeLogMessage('Error: ', logs));
  }

  public warn(...logs: any): void {
    return console.warn(Logger.writeLogMessage('Warn: ', logs));
  }

  public info(...logs: any): void {
    return console.info(Logger.writeLogMessage('Info: ', logs));
  }

  public log(...logs: any): void {
    return console.log(Logger.writeLogMessage('Log: ', logs));
  }

  private static writeLogMessage(prefix: string, logs: any[]): string {
    const segments = logs.map(Logger.logItemToString);

    return prefix + segments.join('\n');
  }

  private static logItemToString(item: any): string {
    if (typeof item === 'string') {
      return item;
    }

    if (typeof item === 'number') {
      return String(item);
    }

    if (item instanceof Error) {
      return JSON.stringify(item, Object.getOwnPropertyNames(item));
    }

    return JSON.stringify(item);
  }
}
