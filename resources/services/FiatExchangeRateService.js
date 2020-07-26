import BaseUrlService from "./BaseUrlService";
import axios from "axios";

export default class FiatExchangeRateService extends BaseUrlService {
    /**
     * @param {string} pair
     * @returns {Promise<AxiosResponse<number>>}
     */
    getExchangeRate(pair) {
        return axios
            .get(process.env.VUE_APP_BASE_HOST_URL + "/exchange/" + pair)
            .then((response) => response.data);
    }
}
