import getTestAttribute from "../../utils/getTestAttribute";

beforeEach(() => {
    cy.server();

    cy.route('/coins', []);
    cy.route('/exchange/usdeur', 0.988);
});

describe('Entry', () => {
    it('Visits base site', () => {
        cy.visit('/');

        getTestAttribute('center-empty-text')
            .should('be.visible');

        getTestAttribute('fab-button-add')
            .should('be.visible');
    });
});
