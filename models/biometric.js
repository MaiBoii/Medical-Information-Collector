const Sequelize = require('sequelize');

module.exports = class Biometric extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
              oxygen_saturation: {
                type: Sequelize.DECIMAL(5, 2),
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
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
              },
              temperature: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false
              }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'BioMetric',
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