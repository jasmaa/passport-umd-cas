# passport-umd-cas

[![npm version](https://badge.fury.io/js/passport-umd-cas.svg)](https://badge.fury.io/js/passport-umd-cas)

Passport strategy for UMD CAS login system

## Install
    npm install passport-umd-cas

## Usage
    passport.use(new UMDCASStrategy());

    app.get('/user', passport.authenticate('umd-cas'), (req, res) => {
        res.send(req.user);
    });
