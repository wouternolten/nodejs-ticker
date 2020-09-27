import BaseUrlService from './BaseUrlService';
import axios from 'axios';

export class SymbolService extends BaseUrlService {
  /**
   * @param {string} currency
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchFilteredSymbols(currency) {
    return axios
      .get(this.baseUrl + "/symbols?currency=" + currency)
      .then((response) => response.data);
  }
}
