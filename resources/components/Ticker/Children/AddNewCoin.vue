<template>
    <div class="md-overlay" test-id="coin-overlay">
        <form novalidate class="md-layout centered" @submit.prevent="validateCoin">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">{{ selectedCoin ? 'Edit coin' : 'Add new coin' }}</div>
                </md-card-header>

                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                          <md-progress-spinner class="absolute__center" v-if="!availablePairs" md-mode="indeterminate"></md-progress-spinner>
                          <h4 v-if="availablePairs && availablePairs.length === 0">No pairs available for this currency. Please select an other currency.</h4>
                          <md-autocomplete
                            v-if="availablePairs && availablePairs.length > 0"
                            name="form-symbol"
                            v-model="form.symbol"
                            :md-options="availablePairs"
                            :class="getValidationClass('symbol')"
                            test-id="input-symbol-name">
                            <label>Symbol name</label>
                            <span class="md-error" v-if="!$v.form.symbol.required">Symbol is required.</span>
                            <span class="md-error" v-else-if="!$v.form.symbol.minLength">Should be at least 1 character.</span>
                            <span class="md-error" v-else-if="!$v.form.symbol.maxLength">Can have a max of 10 characters.</span>
                            <span class="md-error" v-else-if="!$v.form.symbol.pattern">Only letters allowed.</span>
                            <span class="md-error" v-else-if="!$v.form.symbol.mustBeInArray">Ticker {{form.symbol}} doesn't exist for currency.</span>
                          </md-autocomplete>
                        </div>

                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('amount')">
                                <label for="form-amount">Amount</label>
                                <md-input name="form-amount" type="number" id="form-amount" v-model="form.amount" :disabled="sending" test-id="input-coin-amount"/>
                                <span class="md-error" v-if="!$v.form.amount.required">Amount is required.</span>
                                <span class="md-error" v-else-if="!$v.form.amount.minValue">Amount should have a minimum of 0.</span>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>

                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="sending" test-id="button-coin-add">{{ selectedCoin ? 'Save' : 'Add' }}</md-button>
                    <md-button @click="closeForm" class="md-primary" :disabled="sending" test-id="button-coin-cancel">Cancel</md-button>
                </md-card-actions>
            </md-card>
        </form>
    </div>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import {
        required,
        minLength,
        maxLength,
        minValue
    } from 'vuelidate/lib/validators';
    import {pattern, inArray} from "../../../lib/utils/validators";
    import axios from 'axios';
    import { SymbolService } from "../../../services/SymbolService";

    const BASE = 'USDT';

    export default {
        name: "AddNewTicker",
        mixins: [validationMixin],
        props: {
            selectedCoin: Object
        },
        created() {
              this.symbolService
                .fetchFilteredSymbols(BASE)
                .then(result => this.availablePairs = result.map((pair) => pair.slice(0, pair.lastIndexOf(BASE))));
        },
        mounted() {
          if(this.selectedCoin) {
              this.form.symbol = this.selectedCoin.symbol.toUpperCase();
              this.form.amount = this.selectedCoin.amount;
          }
        },
        data: () => ({
            form: {
                symbol: null,
                amount: null
            },
            sending: false,
            availablePairs: null,
            symbolService: new SymbolService()
        }),
        validations() {
          return {
            form: {
              symbol: {
                required,
                minLength: minLength(1),
                maxLength: maxLength(10),
                pattern: pattern(/^[A-Za-z]+$/),
                mustBeInArray: inArray(this.availablePairs)
              },
              amount: {
                required,
                minValue: minValue(0)
              }
            }
          }
        },
        methods: {
            getValidationClass (fieldName) {
                const field = this.$v.form[fieldName]

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            closeForm() {
                this.$emit('closeForm', { reloadTickers: true });
            },
            clearForm() {
                this.$v.$reset();
                this.symbol = null;
                this.amount = null;
            },
            saveForm() {
                this.sending = true;

                const data = {
                    symbol: this.form.symbol.toUpperCase(),
                    amount: +this.form.amount
                };

                if (this.selectedCoin) {
                    data.id = this.selectedCoin.id;
                }

                return axios.post(
                    process.env.VUE_APP_BASE_HOST_URL + '/coins',
                    data
                ).then(() => {
                    this.sending = false;
                    this.clearForm();
                    this.closeForm();
                })
                .catch((error) => {
                    console.log(error);
                    this.sending = false;
                });
            },
            validateCoin() {
                this.$v.$touch();

                if (!this.$v.$invalid) {
                    this.saveForm();
                }
            }
        }
    }
</script>

<style scoped>
.centered {
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
