export class InvalidSymbolException {
    constructor (symbol: string) {
        Error.apply(this, arguments);
    }
}
