const chai = require('chai');
const expect = chai.expect;
const Strategy = require('../lib/strategy');

let mock;

chai.use(require('chai-passport-strategy'));

describe('Strategy authentication', () => {

    before(() => {

        // Mock CAS
        const axios = require("axios");
        const MockAdapter = require("axios-mock-adapter");
        mock = new MockAdapter(axios);

        mock.onGet(
            "https://shib.idm.umd.edu/shibboleth-idp/profile/cas/serviceValidate?ticket=invalidTicket&service=http://localhost/example/callback"
        ).reply(200, `<?xml version="1.0" encoding="UTF-8"?>
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationFailure code="INVALID_TICKET">
        E_INVALID_TICKET_FORMAT
    </cas:authenticationFailure>
</cas:serviceResponse>`);

        mock.onGet(
            "https://shib.idm.umd.edu/shibboleth-idp/profile/cas/serviceValidate?ticket=validTicket&service=http://localhost/example/callback"
        ).reply(200, `<?xml version="1.0" encoding="UTF-8"?>
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationSuccess>
        <cas:user>studentUID</cas:user>
            <cas:attributes>
                <cas:uid>studentUID</cas:uid>
            </cas:attributes>
        </cas:authenticationSuccess>
</cas:serviceResponse>`);
    });

    after(() => {
        mock.restore();
    });

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

    describe('Receiving request with valid ticket', () => {

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
                    req.query = { ticket: 'validTicket' };
                    req.protocol = 'http';
                    req.get = param => param == 'host' ? 'localhost' : null;
                })
                .authenticate();
        });

        it('successfully authenticates', () => {
            expect(user).to.have.property('uid', 'studentUID')
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
                    req.query = { ticket: 'invalidTicket' };
                    req.protocol = 'http';
                    req.get = param => param == 'host' ? 'localhost' : null;
                })
                .authenticate();
        });

        it('fails to authenticate', () => {
            expect(error).to.equal('Authentication failed');
        });
    });

    describe('Receiving request with valid ticket and onSuccess callback', () => {
        
        const strategy = new Strategy({ callbackURL: '/example/callback' }, (profile, done) => {
            done({
                name: profile.uid
            });
        });
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
                    req.query = { ticket: 'validTicket' };
                    req.protocol = 'http';
                    req.get = param => param == 'host' ? 'localhost' : null;
                })
                .authenticate();
        });

        it('successfully authenticates', () => {
            expect(user).to.have.property('name', 'studentUID')
        });
    });
});