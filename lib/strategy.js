const Strategy = require('passport-strategy');
const axios = require('axios');
const xml2js = require('xml2js');

class UMDCASStrategy extends Strategy {

    constructor() {
        super();
        this.name = 'umd-cas';
    }

    authenticate(req, options) {

        const url = req.protocol + '://' + req.get('host') + req.path;

        if (req.query.ticket) {
            axios.get(`https://shib.idm.umd.edu/shibboleth-idp/profile/cas/serviceValidate?ticket=${req.query.ticket}&service=${url}`)
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
            this.redirect(`https://shib.idm.umd.edu/shibboleth-idp/profile/cas/login?service=${url}`);
        }
    }
}

module.exports = UMDCASStrategy;