export class IllegalCharacterException extends Error {
    constructor (illegalCharacterString: string) {
        super('Illegal character in string: ' + illegalCharacterString);
    }
}
