const Sequelize = require('sequelize');

module.exports = class Patient extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
              name: {
                type: Sequelize.STRING(30),
                allowNull: false
              },
              gender: {
                type: Sequelize.ENUM('Male', 'Female', 'Other'),
                allowNull: false
              },
              age: {
                type: Sequelize.INTEGER,
                allowNull: false
              },
              profile_img: {
                type: Sequelize.STRING(200),
                allowNull: true
              },
              room_number: {
                type: Sequelize.STRING(10),
                allowNull: false
              },
              email: {
                type: Sequelize.STRING(40),
                allowNull: false
              },
              address: {
                type: Sequelize.STRING(100),
                allowNull: false
              }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Patient',
            tableName: 'patient',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Patient.hasMany(db.Biometric, { 
          foreignKey: 'patient_id', 
          sourceKey: 'id' 
        });
    }
}