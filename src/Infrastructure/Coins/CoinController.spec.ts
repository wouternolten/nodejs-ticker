import {CoinController} from "./CoinController";
import {ICoin} from "../../Domain/Coins/ICoin";
/* tslint:disable:no-var-requires*/
/* eslint-disable @typescript-eslint/no-var-requires */
const validate = require("../../../lib/utils/validate");
import express from "express";

describe('CoinController test suite', () => {
  let coinController: CoinController;
  let coinService: any;

  beforeEach(() => {
    coinService = { retrieveAllCoins: jest.fn(), storeCoin: jest.fn() };
    coinController = new CoinController(coinService);
  });

  describe('get', () => {
    it('Should return a status of 200 with all coins on successful request', async () => {
      const coins: ICoin[] = [
        { symbol: 'BTC', amount: 1 },
        { symbol: 'ETH', amount: 2 },
      ];

      const response: any = {};

      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue(response);

      coinService.retrieveAllCoins.mockReturnValue(Promise.resolve(coins));

      expect.assertions(2);

      await coinController.get(response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(coins);
    });

    it('Should return a status of 500 with an error message', async () => {
      coinService.retrieveAllCoins.mockReturnValue(Promise.reject('ERROR'));

      const response: any = {};

      response.status = jest.fn().mockReturnValue(response);
      response.send = jest.fn().mockReturnValue(response);

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

      const response: any = {};

      response.status = jest.fn().mockReturnValue(response);
      response.send = jest.fn().mockReturnValue(response);

      validate.validate = jest.fn(() => { throw new Error('Bad request'); });
      expect.assertions(3);

      coinController.store(invalidCoin, response);

      expect(JSON.stringify(validate.validate.mock.calls[0][0])).toEqual(JSON.stringify(invalidCoin));
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send.mock.calls[0][0]).toContain('Bad request');
    });

    it('Should return a 201 when coin is succesfully stored', () => {
      const validCoin: any = {
        body: {
          amount: 3,
          symbol: 'BTC'
        }
      } as express.Request;

      const response: any = {};

      response.status = jest.fn().mockReturnValue(response);
      response.send = jest.fn().mockReturnValue(response);
      expect.assertions(2);

      coinService.storeCoin.mockReturnValue(Promise.resolve());

      return coinController.store(validCoin, response)
        .then(() => {
          expect(response.status).toHaveBeenCalledWith(201);
          expect(coinService.storeCoin).toHaveBeenCalledWith(validCoin.body);
      });
    })
  })
})
