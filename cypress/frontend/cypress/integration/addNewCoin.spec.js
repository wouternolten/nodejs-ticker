import getTestAttribute from "../../utils/getTestAttribute";

const addButtonAttribute = 'button-coin-add';
const cancelButton = 'button-coin-cancel';
const symbolInput = 'input-symbol-name';
const amountInput = 'input-coin-amount';

beforeEach(() => {
    cy.server();
    cy.route('/coins', []).as('coins');
    cy.route('/exchange/usdeur', 0.988).as('exchange');
    cy.route('/symbols?currency=**', ['BTCUSDT', 'ETHUSDT', 'XRPUSDT']).as('filteredSymbol');


    cy.visit('/');
    getTestAttribute('fab-button-add').click();
});
describe('Dialog box basics', () => {

    it('Should show dialog box when add button is clicked', () => {
        getTestAttribute('coin-overlay')
            .should('be.visible');
    });

    it('Dialog box should contain a coin name and amount', () => {
        getTestAttribute(symbolInput)
            .should('be.visible');

        getTestAttribute(amountInput)
            .should('be.visible');
    });

    it('Should contain an add and cancel button', () => {
        getTestAttribute(addButtonAttribute)
            .should('be.visible');

        getTestAttribute('button-coin-cancel')
            .should('be.visible');
    });

    it('Should return back to the home screen when pressing cancel', () => {
        getTestAttribute(cancelButton).click();

        getTestAttribute('fab-button-add')
            .should('be.visible');
    });
});
describe('Errors in form', () => {
    it('Should show errors when pressing the add button directly', () => {
        getTestAttribute(addButtonAttribute).click();

        cy.get('.md-error').should('have.length', 2);
    });

    it('Should show error when symbol name has more than 10 characters', () => {
        getTestAttribute(symbolInput).find('input').type('SOMEBODYONCE');

        getTestAttribute(addButtonAttribute).click();

        cy.get('.md-error')
            .first()
            .contains('Can have a max of 10 characters');
    });

    it('Should show error when symbol name not only letters', () => {
        getTestAttribute(symbolInput).find('input').type('B T C');

        getTestAttribute(addButtonAttribute).click();

        cy.get('.md-error')
            .first()
            .contains('Only letters allowed');
    });

    it('Should show error when amount is less than zero', () => {
        getTestAttribute(symbolInput).find('input').type('BTC');
        getTestAttribute(amountInput).type('-1');

        getTestAttribute(addButtonAttribute).click();

        cy.get('.md-error')
            .first()
            .contains('Amount should have a minimum of 0')
    });

    it('Should should only accept numbers in amount field', () => {
        getTestAttribute(symbolInput).find('input').type('BTC');
        getTestAttribute(amountInput).type('b');

        getTestAttribute(addButtonAttribute).click();

        cy.get('.md-error')
            .first()
            .contains('Amount is required')
    });

    it('Should only accept existing tickers for currency', () => {
      getTestAttribute(symbolInput).find('input').type('INVALID');
      getTestAttribute(amountInput).type('1');

      getTestAttribute(addButtonAttribute).click();

      cy.get('.md-error')
        .first()
        .contains('Ticker INVALID doesn\'t exist for currency.');
    })
});
describe('Happy flow form', () => {
    it('Should make a POST call to coin when adding a valid coin', () => {
        cy.route('POST', '/coins', []).as('postCoins');
        const symbol = 'BTC';
        const amount = '10';

        getTestAttribute(symbolInput).find('input').type(symbol);
        getTestAttribute(amountInput).type(amount);

        getTestAttribute(addButtonAttribute).click();

        cy.wait('@postCoins').should((response) => {
            expect(response.request.body.symbol).equal(symbol.toUpperCase());
            expect(response.request.body.amount).equal(+amount);
        });
    });
});
