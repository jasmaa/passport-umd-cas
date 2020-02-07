const chai = require('chai');
const expect = chai.expect;
const Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));

describe('Strategy invalid', () => {

    describe('Create strategy with no options', () => {

        it('fails with TypeError', () => {
            const test = () => new Strategy();
            expect(test).to.throw('UMDCASStrategy needs a callback url');
        });
    });

    describe('Create strategy with empty options', () => {

        it('fails with TypeError', () => {
            const test = () => new Strategy({});
            expect(test).to.throw('UMDCASStrategy needs a callback url');
        });
    });

    describe('Create strategy with malformed options', () => {

        it('fails with TypeError', () => {
            const test1 = () => new Strategy(6);
            const test2 = () => new Strategy({ someKey: '' });

            expect(test1).to.throw('UMDCASStrategy needs a callback url');
            expect(test2).to.throw('UMDCASStrategy needs a callback url');
        });
    });
    
});