import express from 'express';

export interface ISymbolController {
  get(request: express.Request, response: express.Response): Promise<express.Response>;
}
