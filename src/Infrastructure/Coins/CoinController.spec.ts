/* tslint:disable:no-var-requires*/
/* eslint-disable @typescript-eslint/no-var-requires */
import {CoinController} from "./CoinController";
import {ICoin} from "../../Domain/Coins/ICoin";
const validate = require("../../../lib/utils/validate");
import express from "express";
import {BAD_REQUEST, NO_CONTENT} from "http-status-codes";

function checkIfCallsAreEqual(actualCalls: any, expectedCalls: any): void {
  return expect(JSON.stringify(actualCalls)).toEqual(JSON.stringify(expectedCalls));
}

describe('CoinController test suite', () => {
  let coinController: CoinController;
  let coinService: any;
  let logger: any;
  let response: any;

  beforeEach(() => {
    coinService = { retrieveAllCoins: jest.fn(), storeCoin: jest.fn(), deleteCoin: jest.fn(), changeCoin: jest.fn() };
    logger = { error: jest.fn(), log: jest.fn(), info: jest.fn() };
    coinController = new CoinController(coinService, logger);
    response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    response.send = jest.fn().mockReturnValue(response);
  });

  describe('get', () => {
    it('Should return a status of 200 with all coins on successful request', async () => {
      const coins: ICoin[] = [
        { symbol: 'BTC', amount: 1 },
        { symbol: 'ETH', amount: 2 },
      ];

      coinService.retrieveAllCoins.mockReturnValue(Promise.resolve(coins));

      expect.assertions(2);

      await coinController.get(response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(coins);
    });

    it('Should return a status of 500 with an error message', async () => {
      coinService.retrieveAllCoins.mockReturnValue(Promise.reject('ERROR'));

      expect.assertions(2);

      await coinController.get(response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledWith('Error while retrieving coins. Please check logs.');
    });
  });

  describe('store', () => {
    it('Should return a bad request for an invalid object', () => {
      const invalidCoin: any = {
        body: {
          symbol: 3,
          amount: 'BTC'
        }
      } as express.Request;

      validate.validate = jest.fn(() => { throw new Error('Bad request'); });
      expect.assertions(3);

      coinController.store(invalidCoin, response);

      checkIfCallsAreEqual(validate.validate.mock.calls[0][0], invalidCoin);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send.mock.calls[0][0]).toContain('Bad request');
    });

    it('Should return a 500 when the service throws an error', () => {
      const validCoin: any = {
        body: {
          amount: 3,
          symbol: 'BTC'
        }
      } as express.Request;

      expect.assertions(2);

      validate.validate = jest.fn(() => { return; });
      coinService.storeCoin.mockReturnValue(Promise.reject());

      return coinController.store(validCoin, response)
        .then(() => {
          expect(response.status).toHaveBeenCalledWith(500);
          expect(response.send).toHaveBeenCalled();
        });
    });

    it('Should return a 201 when coin is succesfully stored', () => {
      const validCoin: any = {
        body: {
          amount: 3,
          symbol: 'BTC'
        }
      } as express.Request;

      expect.assertions(2);

      validate.validate = jest.fn(() => { return; });
      coinService.storeCoin.mockReturnValue(Promise.resolve());

      return coinController.store(validCoin, response)
        .then(() => {
          expect(response.status).toHaveBeenCalledWith(201);
          expect(coinService.storeCoin).toHaveBeenCalledWith(validCoin.body);
      });
    });
  });

  describe('delete', () => {
    it('Should return a bad request for an invalid request', () => {
      const invalidRequest = {
        body: '1NVAL1D'
      } as express.Request;

      validate.validate = jest.fn(() => { throw new Error('Bad request'); });
      expect.assertions(4);

      coinController.delete(invalidRequest, response);

      expect(validate.validate).toBeCalled();
      checkIfCallsAreEqual(validate.validate.mock.calls[0][0], invalidRequest);
      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send.mock.calls[0][0]).toContain('Bad request');
    });

    it('Should return a 500 when the service throws an error', () => {
      const validCoin: any = {
        body: {
          id: 3
        }
      } as express.Request;

      expect.assertions(2);

      validate.validate = jest.fn(() => { return; });
      coinService.deleteCoin.mockReturnValue(Promise.reject());

      return coinController.delete(validCoin, response)
        .then(() => {
          expect(response.status).toHaveBeenCalledWith(500);
          expect(response.send).toHaveBeenCalled();
        });
    });

    it('Should return a status of NO CONTENT when a coin is successfully deleted', () => {
      const validRequest = {
        body: {
          id: 3
        }
      } as express.Request;

      expect.assertions(2);

      validate.validate = jest.fn(() => { return; });
      coinService.deleteCoin.mockReturnValue(Promise.resolve(NO_CONTENT));

      return coinController
        .delete(validRequest, response)
        .then(() => {
          expect(response.status).toHaveBeenCalledWith(NO_CONTENT);
          expect(response.send).toHaveBeenCalled();
        })
    });
  });
});
