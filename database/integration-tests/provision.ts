import { config } from "dotenv";
import { resolve } from "path";
import {ISampleDataType} from "./helpers/ISampleDataType";
import {MySqlDatabaseConnection} from "../../lib/database/MySql/MySqlDatabaseConnection";
import "reflect-metadata";
import { readdir } from "fs";
import {IDatabaseSampleData} from "./helpers/IDatabaseSampleData";

const DEFAULT_DATABASE_PORT = '3306';
const SAMPLE_DATA_LOCATION = __dirname + '/sample-data';

config({ path: resolve(__dirname, "../../.env") });

const connection = new MySqlDatabaseConnection(
  process.env.INTEGRATION_DATABASE_PASSWORD,
  process.env.INTEGRATION_DATABASE_PORT || DEFAULT_DATABASE_PORT
);

const addRow = async (tableName: string, data: Record<string, ISampleDataType>): Promise<void> => {
  const keys = Object.keys(data).join(',');
  const values = Object.values(data).map((dataType: ISampleDataType) => dataType.getValue());

  const queryString = `INSERT INTO ${tableName} (${keys}) VALUES (?,?,?,?)`;

  await connection.execute(queryString, values);
}

async function parseSampleData(sampleData: IDatabaseSampleData): Promise<void> {
  const table = sampleData.table;
  await Promise.all(sampleData.data.map((data: Record<string, ISampleDataType>) => addRow(table, data)));
}

async function parseFile(fileName: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const file = require(`${SAMPLE_DATA_LOCATION}/${fileName}`);

  if(!file.getSampleData) {
    console.error(`File ${fileName} doesn't contain getSampleData() function. Skipping.`);
    return;
  }

  const sampleDataArray: IDatabaseSampleData[] = file.getSampleData();
  sampleDataArray.forEach((sampleData: IDatabaseSampleData) => parseSampleData(sampleData));
}

async function provisionFiles(fileNames: string[]): Promise<void> {
  await connection.beginTransaction();
  await Promise.all(fileNames.map((fileName) => parseFile(fileName)));
  await connection.commit();
}

readdir(SAMPLE_DATA_LOCATION, (err, files) => {
  if(err) console.error(err);

  provisionFiles(files)
    .then(() => console.log('Done!'))
    .catch((error) => console.error(error));
});
