# passport-umd-cas

[![npm version](https://img.shields.io/npm/v/passport-umd-cas)](https://www.npmjs.com/package/passport-umd-cas)
[![CircleCI](https://img.shields.io/circleci/build/github/jasmaa/passport-umd-cas)](https://circleci.com/gh/jasmaa/passport-umd-cas)
[![Codecov](https://img.shields.io/codecov/c/github/jasmaa/passport-umd-cas)](https://codecov.io/gh/jasmaa/passport-umd-cas)
[![npm downloads](https://img.shields.io/npm/dt/passport-umd-cas)](https://www.npmjs.com/package/passport-umd-cas)

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
            res.send(req.user);
        } else {
            res.send('Please login');
        }
    });
