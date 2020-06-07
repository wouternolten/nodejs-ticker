import express from 'express';

export interface ICoinController {
  get(response: express.Response): Promise<express.Response>;
  store(request: express.Request, response: express.Response): Promise<express.Response>;
  put(request: express.Request, response: express.Response): Promise<express.Response>;
  delete(request: express.Request, response: express.Response):  Promise<express.Response>;
}
