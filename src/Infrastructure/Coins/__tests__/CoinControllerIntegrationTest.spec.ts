import {MySqlDatabaseConnection} from "../../../../lib/database/MySql/MySqlDatabaseConnection";
import dotenv from "dotenv";

interface IIntegrationRecord {
  [column: string]: string|number;
}

let connection: MySqlDatabaseConnection;

async function mockRecord(table: string, record: IIntegrationRecord): Promise<void>
{
  const columns = [];
  const mappedValues = [];

  for(const column of Object.keys(record)) {
    columns.push(column);
    mappedValues.push(`:${column}`);
  }

  const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${mappedValues.join(',')})`;

  await connection.execute(query, record);
}

async function getRecord(
  table: string,
  identifierField: string,
  identifierValue: string): Promise<any> {
  return connection.execute(`SELECT * FROM ${table} WHERE ${identifierField} = "${identifierValue}"`, null);
}

beforeAll(async (done) => {
    dotenv.config();

    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PORT = '3307';
    process.env.DATABASE_PASSWORD = process.env.ACCEPTANCE_DATABASE_PASSWORD;

    connection = new MySqlDatabaseConnection();

    await connection.beginTransaction();
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0', null);

    done();
})

it('Should test the database', async (done) => {
  const record = {
    "symbol": "BTC",
    "amount": 0.05,
    "created_at": "2020-01-01 12:00:00",
    "updated_at": "2020-01-01 12:00:00"
  };

  await mockRecord('tic_coins', record);

  const getRec = await getRecord('tic_coins', 'symbol', 'BTC');

  expect(getRec[0].symbol).toEqual('BTC');
  expect(parseFloat(getRec[0].amount)).toEqual(0.05);

  done();
});

afterAll(async (done) => {
  await connection.rollback();
  await connection.close();

  done();
});
