const chai = require('chai');
const expect = chai.expect;
const Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));

describe('Strategy valid', () => {

    describe('Create strategy with non-authenticated request', () => {

        const strategy = new Strategy({ callbackURL: '/example/callback' });
        let redirectURL;

        before(done => {
            chai.passport.use(strategy)
                .redirect(url => {
                    redirectURL = url;
                    done();
                })
                .req(req => {
                    // Mock request
                    req.query = {};
                    req.protocol = 'http';
                    req.get = param => param == 'host' ? 'localhost' : null;
                })
                .authenticate();
        });

        it('has callback url', () => {
            expect(strategy._callbackURL).to.equal('/example/callback');
        });
        it('redirects to login url', () => {
            expect(redirectURL).to.equal('https://shib.idm.umd.edu/shibboleth-idp/profile/cas/login?service=http://localhost/example/callback');
        });
    });
});