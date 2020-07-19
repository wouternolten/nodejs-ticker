/**
 * @param {string} attributeName
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export default function getTestAttribute(attributeName) {
    return cy.get(`[test-id=${attributeName}]`);
}
