const Strategy = require('passport-strategy');
const axios = require('axios');
const xml2js = require('xml2js');

/**
 * UMD CAS Stategy
 * 
 * Options:
 *   - `callbackURL` relative url that redirects from login
 * 
 * Examples:
 *      passport.use(new UMDCASStrategy({ callbackURL: /umd/return }));     
 */
class UMDCASStrategy extends Strategy {

    constructor(options, onSuccess) {
        super();
        this.name = 'umd-cas';

        options = options || {};
        if (!options.callbackURL) { throw new TypeError('UMDCASStrategy needs a callback url') }

        this._callbackURL = options.callbackURL;
        this._onSuccess = onSuccess;
    }

    authenticate(req, options) {

        const url = req.protocol + "://" + req.get('host');

        if (req.query.ticket) {

            axios.get(`https://shib.idm.umd.edu/shibboleth-idp/profile/cas/serviceValidate?ticket=${req.query.ticket}&service=${url + this._callbackURL}`)
                .then(response => xml2js.parseStringPromise(response.data))
                .then(result => {
                    
                    if('cas:authenticationSuccess' in result['cas:serviceResponse']) {
                        const user = {
                            uid: result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:attributes'][0]['cas:uid'][0],
                        };

                        if (this._onSuccess) {
                            this._onSuccess(user, this.success);
                        } else {
                            this.success(user);
                        }
                    } else {
                        this.fail('Authentication failed', 400);
                    }
                })
                .catch(_ => {
                    this.fail('Authentication failed', 400);
                });
        }
        else {
            this.redirect(`https://shib.idm.umd.edu/shibboleth-idp/profile/cas/login?service=${url + this._callbackURL}`);
        }
    }
}

module.exports = UMDCASStrategy;