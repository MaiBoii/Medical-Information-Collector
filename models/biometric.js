const Sequelize = require('sequelize');

module.exports = class Biometric extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
              oxygen_saturation: {
                type: Sequelize.INTEGER,
                allowNull: false
              },
              respiration_rate: {
                type: Sequelize.INTEGER,
                allowNull: false
              },
              heart_rate: {
                type: Sequelize.INTEGER,
                allowNull: false
              },
              distance_travelled: {
                type: Sequelize.FLOAT(5, 2),
                allowNull: false
              },
              temperature: {
                type: Sequelize.FLOAT(5, 2),
                allowNull: false
              },
              created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('now()'),
              },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Biometric',
            tableName: 'biometric',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Biometric.belongsTo(db.Patient, { 
          foreignKey: 'patient_id', 
          targetKey: 'id' 
        });
    }
}