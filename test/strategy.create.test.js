const chai = require('chai');
const expect = chai.expect;
const Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));

describe('Strategy creation', () => {

    describe('Create valid strategy', () => {

        const strategy = new Strategy({ callbackURL: '/example/callback' });

        it('has callback url', () => {
            expect(strategy._callbackURL).to.equal('/example/callback');
        });
    });

    describe('Create invalid strategy with no options', () => {

        it('fails with TypeError', () => {
            const test = () => new Strategy();
            expect(test).to.throw('UMDCASStrategy needs a callback url');
        });
    });

    describe('Create invalid strategy with empty options', () => {

        it('fails with TypeError', () => {
            const test = () => new Strategy({});
            expect(test).to.throw('UMDCASStrategy needs a callback url');
        });
    });

    describe('Create invalid strategy with malformed options', () => {

        it('fails with TypeError', () => {
            const test1 = () => new Strategy(6);
            const test2 = () => new Strategy({ someKey: '' });

            expect(test1).to.throw('UMDCASStrategy needs a callback url');
            expect(test2).to.throw('UMDCASStrategy needs a callback url');
        });
    });

    describe('Create valid strategy with onSuccess callback', () => {

        function onSuccess(profile, done) {
            done({
                name: profile.uid
            });
        }

        const strategy = new Strategy({ callbackURL: '/example/callback' }, onSuccess);

        it('has callback function', () => {
            expect(strategy._onSuccess).to.equal(onSuccess);
        });
    });

});