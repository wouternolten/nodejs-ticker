import "reflect-metadata";
import {Container} from "inversify";
import {CoinRepository} from "../../src/Infrastructure/Coins/CoinRepository";
import {TYPES} from "../../types/inversify/types";
import {MySqlDatabaseConnection} from "../database/MySql/MySqlDatabaseConnection";
import {Logger} from "../utils/logger";
import bindControllerContainers from "./controllers/controllers.config";
import bindServiceContainers from "./services/services.config";

const container = new Container();

bindControllerContainers(container);
bindServiceContainers(container);
container.bind<CoinRepository>(TYPES.CoinRepository).to(CoinRepository);
container.bind<MySqlDatabaseConnection>(TYPES.MySqlDatabaseConnection).to(MySqlDatabaseConnection);
container.bind<Logger>(TYPES.Logger).to(Logger);

export default container;
