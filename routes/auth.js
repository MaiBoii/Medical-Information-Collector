const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Admin = require("../models/admin");
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/register', isNotLoggedIn, async (req, res, next) => {
    const { email, name, password } = req.body;
    try {
        const exAdmin = await Admin.findOne({ where: { email } });
        if (exAdmin) {
            return res.redirect('/register?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await Admin.create({
            email,
            name,
            password: hash,
        });
        return res.redirect('/patient');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            console.log('로그인 성공');
            console.log('세션에 저장된 admin', user);
            return res.redirect('/patient');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(() => {
        res.redirect('/patient');
    });
});

module.exports = router;
