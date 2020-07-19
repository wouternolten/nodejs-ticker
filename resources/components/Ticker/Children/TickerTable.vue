<template>
    <md-table v-model="tickersWithTotal" md-card test-id="tickers-table">
        <md-table-toolbar>
            <h1 class="md-title">Tickers</h1>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }" test-id="tickers-table-row">
            <md-table-cell md-label="Name" md-sort-by="name" test-id="tickers-row-name">
                <b>{{ item.symbol }}</b>
            </md-table-cell>
            <md-table-cell md-label="Price" md-sort-by="price" test-id="tickers-row-price">
                <template v-if="item.price > 0">{{ formatTickerPrice(item.price) }}</template>
            </md-table-cell>
            <md-table-cell md-label="Amount" md-sort-by="amount" test-id="tickers-row-amount">{{ item.amount }}
            </md-table-cell>
            <md-table-cell md-label="Worth" md-sort-by="worth" test-id="tickers-row-worth">
                <template v-if="item.worth > 0">{{ formatPrice(item.worth) }}</template>
            </md-table-cell>
            <md-table-cell md-label="Actions" test-id="tickers-row-actions">
                <template v-if="item.symbol">
                    <md-button class="md-dense" @click="deleteCoin(item)">
                        <md-icon>delete</md-icon>
                    </md-button>
                    <md-button class="md-dense" @click="editCoin(item)">
                        <md-icon>edit</md-icon>
                    </md-button>
                </template>
            </md-table-cell>
        </md-table-row>
    </md-table>
</template>

<script>
    import formatPrice from "../../../lib/utils/formatPrice";
    import formatTickerPrice from "../../../lib/utils/formatTickerPrice";

    export default {
        name: "TickerTable",
        props: {
            tickers: Array
        },
        computed: {
            tickersWithTotal() {
                const allTickers = [...this.tickers];

                allTickers.push({name:'', price: 0, amount: 'Total', worth: this.getTotalWorth(this.tickers)});

                return allTickers;
            }
        },
        methods: {
            /** @param {Coin} coin */
            editCoin(coin) {
                this.$emit('editCoin', coin);
            },
            /** @param {Coin} coin */
            deleteCoin(coin) {
                this.$emit('deleteCoin', coin);
            },
            getTotalWorth(tickers) {
                return tickers.reduce((totalWorth, ticker) => totalWorth + +ticker.worth, 0);
            },
            formatPrice(amount) {
                return formatPrice(amount);
            },
            formatTickerPrice(amount) {
                return formatTickerPrice(amount);
            }
        }
    }
</script>

<style scoped>

</style>
