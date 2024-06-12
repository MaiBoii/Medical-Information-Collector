'use strict';
const { Biometric, Patient } = require('../models');

async function evaluatePatientHealth({ oxygen_saturation, respiration_rate, heart_rate, temperature }) {
  let status = '안전';

  if (oxygen_saturation < 90 || respiration_rate < 12 || respiration_rate > 30 || heart_rate < 60 || heart_rate > 120 || temperature < 36.0 || temperature > 38.0) {
      status = '위험';
  } else if (oxygen_saturation < 95 || respiration_rate < 12 || respiration_rate > 20 || heart_rate < 60 || heart_rate > 100 || temperature < 36.5 || temperature > 37.5) {
      status = '주의';
  }

  return status;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const patients = await Patient.findAll();

      for (const patient of patients) {
        const biometrics = await Biometric.findAll({ where: { patient_id: patient.id } });

        if (biometrics.length > 0) {
          const latestBiometric = biometrics[biometrics.length - 1];

          const newStatus = await evaluatePatientHealth({
            oxygen_saturation: latestBiometric.oxygen_saturation,
            respiration_rate: latestBiometric.respiration_rate,
            heart_rate: latestBiometric.heart_rate,
            temperature: latestBiometric.temperature,
          });

          await Patient.update({ status: newStatus }, { where: { id: patient.id } });
        }
      }

      console.log('환자의 건강 상태가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('환자의 건강 상태 업데이트 중 오류가 발생했습니다:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await Patient.update({ status: '미정' }, { where: {} });
      console.log('환자의 건강 상태가 성공적으로 초기화되었습니다.');
    } catch (error) {
      console.error('환자의 건강 상태 초기화 중 오류가 발생했습니다:', error);
    }
  }
};
