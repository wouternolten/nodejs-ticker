import "reflect-metadata";
import { Container } from "inversify";
import { CoinController } from "../../src/Infrastructure/Coins/CoinController";
import { CoinService } from "../../src/Domain/Coins/CoinService";
import { CoinRepository } from "../../src/Infrastructure/Coins/CoinRepository";
import { TYPES } from "../../types/inversify/types";
import { MySqlDatabaseConnection } from "../database/MySql/MySqlDatabaseConnection";

const container = new Container();

container.bind<CoinController>(TYPES.CoinController).to(CoinController);
container.bind<CoinService>(TYPES.CoinService).to(CoinService);
container.bind<CoinRepository>(TYPES.CoinRepository).to(CoinRepository);
container.bind<MySqlDatabaseConnection>(TYPES.MySqlDatabaseConnection).to(MySqlDatabaseConnection);

export default container;
