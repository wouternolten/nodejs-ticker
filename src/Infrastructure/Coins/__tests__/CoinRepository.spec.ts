import {CoinRepository} from "../CoinRepository";
import {ICoin} from "../../../Domain/Coins/ICoin";
import {NO_CONTENT, NOT_FOUND} from "http-status-codes";

describe('CoinRepository test suite', () => {
  let coinRepository: CoinRepository;
  let mySqlConnection: any;
  let logger: any;

  beforeEach(() => {
    mySqlConnection = {
      query: jest.fn(),
      commit: jest.fn(),
      close: jest.fn(),
      beginTransaction: jest.fn(),
      rollback: jest.fn(),
      execute: jest.fn(() => ({ affectedRows: 1 }))
    };
    logger = { error: jest.fn(), info: jest.fn() };

    coinRepository = new CoinRepository(mySqlConnection, logger);
  })

  describe('retrieveAllCoins', () => {
    it('Should map all database rows to coin objects', () => {
      const expectedCoins: ICoin[] = [
        {
          id: 1,
          symbol: 'BTC',
          amount: 1,
        },
        {
          id: 2,
          symbol: 'ETH',
          amount: 3.26
        }];

      mySqlConnection.query.mockReturnValue(Promise.resolve([
        {id: '1', symbol: 'BTC', amount: '1'},
        {id: '2', symbol: 'ETH', amount: '3.26'},
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

  describe('deleteCoin', () => {
    it('Should call delete a coin correctly when no errors occur', () => {
      expect.assertions(3);

      return coinRepository
        .deleteCoin(1)
        .then(() => {
          expect(mySqlConnection.beginTransaction).toHaveBeenCalled();
          expect(mySqlConnection.commit).toHaveBeenCalled();
          expect(mySqlConnection.execute).toHaveBeenCalled();
        })
    });

    it('Should return NO CONTENT when a delete request has found database rows', () => {
      expect.assertions(1);

      return coinRepository
        .deleteCoin(1)
        .then((result) => {
          expect(result).toEqual(NO_CONTENT);
        });
    });

    it('Should return NOT FOUND when a delete request has not found any database rows', () => {
      expect.assertions(1);

      mySqlConnection.execute = jest.fn(() => ({ affectedRows: 0 }));

      return coinRepository
        .deleteCoin(1)
        .then((result) => {
          expect(result).toEqual(NOT_FOUND);
        });
    });

    it('Should rollback and throw an error when the database throws an error', async () => {
      expect.assertions(3);

      mySqlConnection.commit.mockRejectedValue('Yo database is broken');

      try {
        await coinRepository.deleteCoin(1);
      } catch(error) {
        expect(error).toBeDefined();
      }

      expect(mySqlConnection.beginTransaction).toHaveBeenCalled();
      expect(mySqlConnection.rollback).toHaveBeenCalled();
    });
  })
});
