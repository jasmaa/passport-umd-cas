const chai = require('chai');
const expect = chai.expect;
const Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));

describe('Strategy authentication', () => {

    describe('Receiving request with no ticket', () => {

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

        it('redirects to login url', () => {
            expect(redirectURL).to.equal('https://shib.idm.umd.edu/shibboleth-idp/profile/cas/login?service=http://localhost/example/callback');
        });
    });

    describe('Receiving request with invalid ticket', () => {

        const strategy = new Strategy({ callbackURL: '/example/callback' });
        let user, info, error;

        before(done => {
            chai.passport.use(strategy)
                .success((u, i) => {
                    user = u;
                    info = i;
                    done();
                })
                .fail(err => {
                    error = err;
                    done();
                })
                .req(req => {
                    // Mock request
                    req.query = {ticket: 'invalidTicket'};
                    req.protocol = 'http';
                    req.get = param => param == 'host' ? 'localhost' : null;
                })
                .authenticate();
        });

        it('fails to authenticate', () => {
            expect(error).to.equal('Authentication failed');
        });
    });
});