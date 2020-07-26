import { helpers } from 'vuelidate/lib/validators'

/**
 * @param {RegExp} regex
 * @returns {function(*=): boolean|*}
 */
export const pattern = (regex) => (value) => !helpers.req(value) || regex.test(value);

