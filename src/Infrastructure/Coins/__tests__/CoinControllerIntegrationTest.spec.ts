import {MySqlDatabaseConnection} from "../../../../lib/database/MySql/MySqlDatabaseConnection";
import dotenv from "dotenv";
import supertest, {SuperTest, Test} from "supertest";
import createApp from "../../../App";
import {CREATED, NO_CONTENT, OK} from "http-status-codes";

interface IIntegrationRecord {
  [column: string]: string|number;
}

let connection: MySqlDatabaseConnection;
let apiServer: SuperTest<Test>;

// Not my finest piece of art. We truncate the tables before and after all integration tests.
// I'd like to do this in a transaction & rollback style, but since we're using that already in the
// repository, this seems to be the best option.
async function truncateAllTables(): Promise<void>
{
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  const tableQueries = await connection.query(`
    SELECT CONCAT('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';') as myQuery
    FROM INFORMATION_SCHEMA.TABLES
    WHERE table_schema IN ('ticker')
    AND TABLE_NAME NOT LIKE 'mysql_migrations%'
  `);

  await Promise.all(tableQueries.map(async (query: { myQuery: string }) => {
      await connection.query(query.myQuery);
    })
  );

  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
}

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

beforeAll(() => {
    dotenv.config();

    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PORT = '3307';
    process.env.DATABASE_PASSWORD = process.env.ACCEPTANCE_DATABASE_PASSWORD;

    connection = new MySqlDatabaseConnection();
    apiServer = supertest(createApp());
});

beforeEach(async (done) => {
  await truncateAllTables();
  done();
});

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

it('Should return a body when GET endpoint is called', async (done) => {
  const record = {
    "symbol": "BTC",
    "amount": 0.05,
    "created_at": "2020-01-01 12:00:00",
    "updated_at": "2020-01-01 12:00:00"
  };

  await mockRecord('tic_coins', record);

  const { body, status } = await apiServer.get('/coins');

  expect(body.length).toBe(1);
  expect(body[0].symbol).toBe("BTC");
  expect(body[0].amount).toBe(0.05);
  expect(status).toBe(OK);

  done();
});

it('Should return a body and status CREATED on a succesful POST attempt', async (done) => {
  const request =
    {
      symbol: "ETH",
      amount: 0.1
    };

    const { body, status } = await apiServer.post('/coins').send(request);

    expect(body.symbol).toEqual(request.symbol);
    expect(body.amount).toEqual(request.amount);
    expect(status).toEqual(CREATED);
    done();
});

it('Should return a 204 on a successful DELETE attempt', async (done) => {
  const record = {
    "symbol": "BTC",
    "amount": 0.05,
    "created_at": "2020-01-01 12:00:00",
    "updated_at": "2020-01-01 12:00:00"
  };

  await mockRecord('tic_coins', record);

  const deleteRows = await connection.query(`SELECT id FROM tic_coins where symbol = 'BTC'`);

  const { status } = await apiServer.delete('/coins').send({id: deleteRows[0].id})
  expect(status).toEqual(NO_CONTENT);
  done();
});

afterEach(async (done) => {
  await truncateAllTables();
  done();
});

afterAll(async (done) => {
  await connection.end();
  done();
});
