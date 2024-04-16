const Sequelize = require('sequelize');

module.exports = class Admin extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            name : {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Admin',
            tableName: 'admin',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}