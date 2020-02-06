# passport-umd-cas

[![npm version](https://badge.fury.io/js/passport-umd-cas.svg)](https://badge.fury.io/js/passport-umd-cas)

Passport strategy for UMD CAS login system

## Install
    npm install passport-umd-cas

## Usage
    passport.use(new UMDCASStrategy({ callbackURL: '/umd/return' }));

    app.get('/umd/login', passport.authenticate('umd-cas'));
    app.get('/umd/return', passport.authenticate('umd-cas'), (req, res) => {
        res.redirect('/')
    });

    app.get('/', (req, res) => {
        if (req.user) {
            res.send(user);
        } else {
            res.send('Please login');
        }
    });
