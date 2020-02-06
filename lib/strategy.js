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

    constructor(options) {
        super();
        this.name = 'umd-cas';

        if (!options.callbackURL) { throw new TypeError("UMDCASStrategy needs a callback url") }

        this._callbackURL = options.callbackURL;
    }

    authenticate(req, options) {

        const url = req.protocol + "://" + req.get('host');

        if (req.query.ticket) {
            axios.get(`https://shib.idm.umd.edu/shibboleth-idp/profile/cas/serviceValidate?ticket=${req.query.ticket}&service=${url + this._callbackURL}`)
                .then(response => xml2js.parseStringPromise(response.data))
                .then(result => {
                    this.success({
                        uid: result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:attributes'][0]['cas:uid'][0],
                    });
                })
                .catch(error => {
                    this.fail(error, 400);
                });
        }
        else {
            this.redirect(`https://shib.idm.umd.edu/shibboleth-idp/profile/cas/login?service=${url + this._callbackURL}`);
        }
    }
}

module.exports = UMDCASStrategy;