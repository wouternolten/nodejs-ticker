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
      rollback: jest.fn(),
      execute: jest.fn()
    };

    coinRepository = new CoinRepository(mySqlConnection);
  })

  describe('retrieveAllCoins', () => {
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
        {symbol: 'BTC', amount: '1'},
        {symbol: 'ETH', amount: '3.26'},
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

  describe('storeCoin', () => {
    it('Should store a coin correctly when no errors occur', async () => {
      const coin: ICoin = {
        symbol: 'BTC',
        amount: 5
      }

      expect.assertions(6);

      await coinRepository.storeCoin(coin);

      expect(mySqlConnection.beginTransaction).toHaveBeenCalled();
      expect(mySqlConnection.execute.mock.calls[0][0]).toContain('symbol');
      expect(mySqlConnection.execute.mock.calls[0][0]).toContain('amount');
      expect(mySqlConnection.execute.mock.calls[0][1].symbol).toEqual(coin.symbol);
      expect(mySqlConnection.execute.mock.calls[0][1].amount).toEqual(coin.amount);
      expect(mySqlConnection.commit).toHaveBeenCalled();
    });

    it('Should rollback and throw an error when the database throws an error', async () => {
      const coin: ICoin = {
        symbol: 'BTC',
        amount: 5
      }

      expect.assertions(3);

      mySqlConnection.commit.mockRejectedValue('Yo database is broken');

      try {
        await coinRepository.storeCoin(coin);
      } catch(error) {
        expect(error).toBeDefined();
      }

      expect(mySqlConnection.beginTransaction).toHaveBeenCalled();
      expect(mySqlConnection.rollback).toHaveBeenCalled();
    });
  });
});
