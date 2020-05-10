export class InvalidSymbolException extends Error {
    constructor (symbol: string) {
        super('Invalid symbol: ' + symbol);
    }
}
