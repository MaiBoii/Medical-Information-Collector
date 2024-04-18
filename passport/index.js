const passport = require('passport');
const local  = require('./localStrategy');
const Admin = require('../models/admin');

module.exports = () => {
    passport.serializeUser((admin, done) => {
        console.log('User Serialized: ', admin);
        done(null, admin.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('User Deserialized: ', id);
        Admin.findOne({ where: { id } })
            .then(admin => done(null, admin))
            .catch(err => done(err));
    });
    local();
};