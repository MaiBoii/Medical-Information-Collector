'use strict';
const { Biometric } = require('../models'); // Biometric 모델 임포트

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Biometric 테이블에 데이터가 있는지 확인
      const existingData = await Biometric.findAll();

      // 데이터가 없을 때만 시딩을 실행
      if (existingData.length === 0) {
        // Biometric 데이터 생성 함수
        const generateBiometricData = async () => {
          try {
            const patients = await queryInterface.sequelize.query('SELECT * FROM patient;'); // 모든 환자 데이터 조회
            const biometricData = [];

            // 각 환자에 대해 10개씩의 Biometric 데이터 생성
            patients[0].forEach(patient => {
              for (let i = 0; i < 1000; i++) {
                // Biometric 데이터 항목 생성
                const data = {
                  oxygen_saturation: getRandomDecimal(90, 100, 2), // 산소 포화도 (90부터 100 사이의 랜덤한 실수)
                  respiration_rate: getRandomInt(12, 20), // 호흡 속도 (12부터 20 사이의 랜덤한 정수)
                  heart_rate: getRandomInt(60, 100), // 심박수 (60부터 100 사이의 랜덤한 정수)
                  distance_travelled: getRandomDecimal(0, 10, 2), // 이동 거리 (0부터 10 사이의 랜덤한 실수)
                  temperature: getRandomDecimal(36, 38, 2), // 체온 (36부터 38 사이의 랜덤한 실수)
                  patient_id: patient.id // 환자 ID
                };

                biometricData.push(data); // Biometric 데이터 배열에 추가
              }
            });

            return biometricData;
          } catch (error) {
            throw new Error('환자 데이터 조회 중 오류가 발생했습니다: ' + error);
          }
        };

        // 주어진 범위 내에서 랜덤한 실수 생성 함수
        const getRandomDecimal = (min, max, decimalPlaces) => {
          const value = Math.random() * (max - min) + min;
          return parseFloat(value.toFixed(decimalPlaces));
        };

        // 주어진 범위 내에서 랜덤한 정수 생성 함수
        const getRandomInt = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        // Biometric 데이터 생성
        const biometricData = await generateBiometricData();

        // 생성된 Biometric 데이터를 DB에 저장
        await Biometric.bulkCreate(biometricData);

        console.log('Biometric 데이터가 성공적으로 생성되었습니다.');
      } else {
        console.log('Biometric 데이터가 이미 존재합니다. Seeding을 스킵합니다.');
      }
    } catch (error) {
      console.error('Biometric 데이터 생성 중 오류가 발생했습니다:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Biometric 테이블의 모든 데이터 삭제
      await queryInterface.bulkDelete('biometric', null, {});

      console.log('Biometric 데이터가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Biometric 데이터 삭제 중 오류가 발생했습니다:', error);
    }
  }
};
