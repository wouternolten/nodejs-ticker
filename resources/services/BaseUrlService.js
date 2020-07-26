export default class BaseUrlService {
    /**
     * @param {string} baseUrl
     */
    constructor(baseUrl = process.env.VUE_APP_BASE_HOST_URL) {
        this.baseUrl = baseUrl;
    }
}
