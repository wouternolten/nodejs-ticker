<template>
  <div>
    <md-progress-spinner class="absolute__center" v-if="!tickers" md-mode="indeterminate"></md-progress-spinner>
    <div v-if="tickers && tickers.length === 0" class="md-layout page__full content--center">
      <h4 class="md-title page__centered" test-id="center-empty-text">Start adding tickers by clicking on the plus button.</h4>
    </div>
    <TickerTable v-if="tickers && tickers.length > 0" :tickers="tickers" v-on:deleteCoin="deleteCoin" v-on:editCoin="editCoin"/>
    <AddNewTicker v-if="showForm" v-on:closeForm="refreshPage" :selectedCoin="selectedCoin"/>

    <div class="fixed__bottom-right">
      <md-button class="md-fab md-primary" @click="showForm = true" test-id="fab-button-add">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>
<script>
  import TickerTable from "./Children/TickerTable";
  import AddNewTicker from "./Children/AddNewCoin";
  import TickerService from "../../services/TickerService";
  import FiatExchangeRateService from "../../services/FiatExchangeRateService";

  // THIS WILL BE CHANGED AFTER MVP.
  const BASE = 'USDT';

  export default {
  name: "TickerScreen",
  components: {AddNewTicker, TickerTable},
  data: () => ({
      tickers: null,
      selectedCoin: null,
      showForm: false,
      tickerService: new TickerService(),
      exchangeRateService: new FiatExchangeRateService()
  }),
  created() {
    return this.refreshPage(true);
  },
  methods: {
    async getTickers() {
      const [coins, rate] = await Promise.all([
        this.tickerService.fetchAllCoins(),
        this.exchangeRateService.getExchangeRate('usdeur')
      ]);

      return this.tickerService.getAllTickers(coins, rate, BASE);
    },
    refreshPage(reloadTickers = false) {
      this.showForm = false;
      this.selectedCoin = null;

      if(reloadTickers) {
        this.tickers = null;
        return this.getTickers().then((tickers) => {
          this.tickers = tickers;
        });
      }
    },
    deleteCoin(coin) {
      return this.tickerService.deleteCoin(coin.id)
              .then(() => this.tickers.splice(this.tickers.findIndex((ticker) => ticker.symbol === coin.symbol), 1));
    },
    editCoin(coin) {
      this.selectedCoin = coin;
      this.showForm = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .fixed__bottom-right {
    position: fixed;
    bottom: 2%;
    right: 2%;
  }

  .absolute__center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .page__full {
    height: 100vh;
  }

  .content--center {
    justify-content: center;
    align-items: center;
  }
</style>
