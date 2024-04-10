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
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});


router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, admin, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!admin) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(admin, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
