const faker = require("faker");

faker.locale = "ko";

const genders = ["남성", "여성", "기타"];
const room_numbers = [
  "101",
  "102",
  "103",
  "104",
  "105",
  "106",
  "107",
  "108",
  "109",
  "110",
];
const status = ["안전", "주의", "위험"];

function getRandomEnumValue(values) {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function getRandomAge() {
  return Math.floor(Math.random() * 100);
}

const patient = [...Array(100)].map((user) => ({
  name: faker.name.lastName() + faker.name.firstName(),
  gender: getRandomEnumValue(genders),
  age: getRandomAge(),
  room_number: getRandomEnumValue(room_numbers),
  email: faker.internet.email(),
  address: faker.address.streetAddress(),
  status: getRandomEnumValue(status),
}));

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Patient 테이블에 데이터가 있는지 확인
      const existingData = await queryInterface.sequelize.query(
        "SELECT * FROM patient;",
      );

      // 데이터가 없을 때만 시딩을 실행
      if (existingData[0].length === 0) {
        await queryInterface.bulkInsert("Patient", patient, {});
        console.log("Patient 데이터가 성공적으로 생성되었습니다.");
      } else {
        console.log("Patient 데이터가 이미 존재합니다. Seeding을 스킵합니다.");
      }
    } catch (error) {
      console.error("Patient 데이터 생성 중 오류가 발생했습니다:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Patient", patient, {});
  },
};
