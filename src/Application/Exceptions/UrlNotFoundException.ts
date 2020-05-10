export class UrlNotFoundException extends Error {
    constructor (url: string) {
        super('Url not found: ' + url);
    }
}
