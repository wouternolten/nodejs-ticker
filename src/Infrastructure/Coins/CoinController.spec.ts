import {CoinController} from "./CoinController";
import {ICoin} from "../../Domain/Coins/ICoin";

describe('CoinController test suite', () => {
  let coinController: CoinController;
  let coinService: any;

  beforeEach(() => {
    coinService = { retrieveAllCoins: jest.fn() };
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
})
