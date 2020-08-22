import getTestAttribute from "../../utils/getTestAttribute";

it('Should show a table with the worth after a coin has been added', () => {
    const symbol1 = {name: 'ETH', amount: 1};
    const symbol2 = {name: 'BTC', amount: 0.5};

    const symbol1Price = 200;
    const symbol2Price = 10000;

    const exchangeRate = 0.988;

    const baseSymbol = 'USDT';

    const coins = [
        {
            "id": 1,
            "symbol": symbol1.name,
            "amount": symbol1.amount
        },
        {
            "id": 2,
            "symbol": symbol2.name,
            "amount": symbol2.amount
        },
    ];

    cy.server();
    cy.route('/coins', coins);
    cy.route(`/ticker?symbol=${symbol1.name}${baseSymbol}`, {symbol: symbol1.name, price: symbol1Price});
    cy.route(`/ticker?symbol=${symbol2.name}${baseSymbol}`, {symbol: symbol2.name, price: symbol2Price});
    cy.route('/exchange/usdeur', exchangeRate);
    cy.visit('/');

    getTestAttribute('tickers-table')
        .find(`[test-id=tickers-table-row]`)
        .then((obj) => expect(obj.length).equal(3));

    checkTableRow(0, symbol1, `197.6`, `€197.60`);
    checkTableRow(1, symbol2, `9880`, `€4940,-`);

    const totalRow = getTestAttribute('tickers-table-row').eq(2);

    checkCellForValue(totalRow, 'amount', 'Total');
    checkCellForValue(totalRow, 'worth', `€5137.60`);
    checkCellForValue(totalRow, 'actions', '');
});

/**
 * @param {number} rowNum
 * @param {Object} symbol
 * @param {string} symbol.name
 * @param {number} symbol.amount
 * @param {string} formattedSymbolPrice
 * @param {string} worth
 */
function checkTableRow(rowNum, symbol, formattedSymbolPrice, worth) {
    const getRow = getTestAttribute('tickers-table-row').eq(rowNum);

    checkCellForValue(getRow, 'name', symbol.name);
    checkCellForValue(getRow, 'amount', symbol.amount);
    checkCellForValue(getRow, 'price', formattedSymbolPrice);
    checkCellForValue(getRow, 'worth', worth);
    checkCellForValue(getRow, 'actions', 'delete edit');
}

function checkCellForValue(row, selector, expectedValue) {
    row
        .then((obj) => {
            const actualValue = obj.find(`[test-id="tickers-row-${selector}"]`).text();
            expect(actualValue).contain(String(expectedValue));
        });
}
