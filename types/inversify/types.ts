import {CONTROLLER_TYPES} from './controllers/controllerTypes';
import {SERVICE_TYPES} from "./services/serviceTypes";

export const TYPES = {
  ...CONTROLLER_TYPES,
  ...SERVICE_TYPES,
  CoinRepository: Symbol("CoinRepository"),
  MySqlDatabaseConnection: Symbol("MySqlDatabaseConnection"),
  Logger: Symbol("Logger"),
};
