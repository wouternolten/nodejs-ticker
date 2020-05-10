import {RetrieveBinanceTicker} from "./RetrieveBinanceTicker";
import {InvalidSymbolException} from "../../Application/Ticker/InvalidSymbolException";

describe('retrieveTicker test', () => {
    let retrieveBinanceTicker: RetrieveBinanceTicker;

    beforeEach(() => {
        retrieveBinanceTicker = new RetrieveBinanceTicker('');
    });

    it('Should throw an error when an invalid symbol is used', async () => {
       expect.assertions(1);

       try {
           await retrieveBinanceTicker.retrieveTicker('INVALIDSYMBOL');
       } catch(e) {
           expect(e).toBeInstanceOf(InvalidSymbolException);
       }
    });
});
