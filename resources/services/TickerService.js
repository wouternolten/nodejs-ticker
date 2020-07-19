import axios from 'axios';
import BaseUrlService from "./BaseUrlService";

export default class TickerService extends BaseUrlService {
    /**
     * @returns {Promise<AxiosResponse<Coin[]>>}
     */
    fetchAllCoins() {
        return axios
            .get(this.baseUrl + "/coins")
            .then((response) => response.data);
    }

    /**
     * @param {string} symbol
     * @param {string} base
     * @returns {Promise<AxiosResponse<number>>}
     */
    getTickerPrice(symbol, base) {
        return axios.get(process.env.VUE_APP_BASE_HOST_URL + "/ticker?symbol=" + symbol + base)
    }

    /**
     * @param {Coin[]} coins
     * @param {number} exchangeRate
     * @param {string} baseSymbol
     * @returns {Promise<Ticker[]>}
     */
    async getAllTickers(coins, exchangeRate, baseSymbol) {
        return Promise.all(
            coins.map(async (coin) =>
                this.getTickerPrice(coin.symbol, baseSymbol)
                    .then((response) => response.data.price * exchangeRate)
                    .then((realPrice) => {
                        coin.price = realPrice;
                        coin.worth = (realPrice * coin.amount);
                        return coin;
                    })
            )
        );
    }

    /**
     * @param {number} id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async deleteCoin(id) {
        return axios.delete(this.baseUrl + '/coins', { data: { id } });
    }
}
