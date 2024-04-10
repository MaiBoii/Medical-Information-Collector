const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Admin = require('../models/admin');

module.exports = () => {
    passport.use(new LocalStrategy({
        adminnameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const exAdmin = await Admin.findOne({ where: { email } });
            if (!exAdmin) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }
            const result = await bcrypt.compare(password, exAdmin.password);
            if (result) {
                done(null, admin);
            } else {
                done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }),);};

