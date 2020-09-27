import { helpers } from 'vuelidate/lib/validators'

/**
 * @param {RegExp} regex
 * @returns {function(*=): boolean|*}
 */
export const pattern = (regex) => (value) => !helpers.req(value) || regex.test(value);

/**
 * @param {Array} array
 * @returns {function(*=): boolean|*}
 */
export const inArray = (array) => (value) => !helpers.req(value) || array.includes(value);
