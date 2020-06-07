import {CoinRepository} from "./CoinRepository";
import {ICoin} from "../../Domain/Coins/ICoin";

describe('CoinRepository test suite', () => {
  let coinRepository: CoinRepository;
  let mySqlConnection: any;

  beforeEach(() => {
    mySqlConnection = {
      query: jest.fn(),
      commit: jest.fn(),
      close: jest.fn(),
      beginTransaction: jest.fn(),
      rollback: jest.fn()
    };

    coinRepository = new CoinRepository(mySqlConnection);
  })

  it('Should map all database rows to coin objects', () => {
    const expectedCoins: ICoin[] = [
      {
        symbol: 'BTC',
        amount: 1,
      },
      {
        symbol: 'ETH',
        amount: 3.26
      }];

    mySqlConnection.query.mockReturnValue(Promise.resolve([
      { symbol: 'BTC', amount: '1' },
      { symbol: 'ETH', amount: '3.26' },
    ]));

    expect.assertions(1);

    return coinRepository
      .retrieveAllCoins()
      .then((coins) => expect(JSON.stringify(coins)).toEqual(JSON.stringify(expectedCoins)));
  });

  it('Should catch exceptions from database and rethrow them', async () => {
    mySqlConnection.query.mockReturnValue(Promise.reject('Rejected'));

    expect.assertions(1);

    try {
      await coinRepository.retrieveAllCoins();
    } catch (error) {
      expect(error).toBeDefined();
    }
  })
});
