import {SymbolController} from "../SymbolController";
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, OK} from "http-status-codes";

describe('SymbolController test suite', () => {
  let response: any;
  let request: any;
  let symbolController: SymbolController;
  let symbolService: any;

  beforeEach(() => {
    request = {
      query: {}
    };
    response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    response.send = jest.fn().mockReturnValue(response);

    symbolService = {
      retrieveAll: jest.fn(),
      retrieveFiltered: jest.fn()
    };

    symbolController = new SymbolController(symbolService);
  });

  it('Should GET all coins when no query parameter is specified', () => {
    const symbols = ['BTCUSDT', 'ETHEUR'];

    symbolService
      .retrieveAll
      .mockResolvedValue(symbols);

    return symbolController.get(request, response)
      .then(res => {
        expect(res.status).toHaveBeenCalledWith(OK);
        expect(res.send).toHaveBeenCalledWith(symbols);
      })
  });

  it('Should GET filtered coins when query parameter is specified', () => {
    const symbols = ['BTCUSDT'];
    request.query.currency = 'USDT';

    symbolService
      .retrieveFiltered
      .mockResolvedValue(symbols);

    return symbolController.get(request, response)
      .then(res => {
        expect(res.status).toHaveBeenCalledWith(OK);
        expect(res.send).toHaveBeenCalledWith(symbols);
      })
  });

  it('Should return a BAD_REQUEST response when the sent parameter is not a string', () => {
    request.query.currency = { bla: 123 };

    return symbolController.get(request, response)
      .then((res) => {
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
      });
  });

  it('Should return a BAD_REQUEST response when sent parameter looks like a string, but is not', () => {
    request.query.currency = '1234';

    return symbolController.get(request, response)
      .then((res) => {
        expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
      });
  });

  it('Should return a INTERNAL_SERVER_ERROR response when retrieving all coins fails', () => {
    symbolService
      .retrieveAll
      .mockRejectedValue();

    return symbolController.get(request, response)
      .then(res => {
        expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
      })
  });

  it('Should return a INTERNAL_SERVER_ERROR response when retrieving filtered coins fails', () => {
    request.query.currency = 'USDT';

    symbolService
      .retrieveFiltered
      .mockRejectedValue();

    return symbolController.get(request, response)
      .then(res => {
        expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
      })
  });
});
