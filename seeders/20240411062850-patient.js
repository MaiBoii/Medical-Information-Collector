const faker = require('faker');

faker.locale = "ko";

const genders = ['남성', '여성', '기타'];
const room_numbers = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110'];
const status = ['안전', '주의', '위험'];


function getRandomEnumValue(values) {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function getRandomAge() {
  return Math.floor(Math.random() * 100);
}

const patient = [...Array(100)].map((user) => (
  {
    name: faker.name.lastName() + faker.name.firstName(),
    gender: getRandomEnumValue(genders),
    age: getRandomAge(),
    room_number: getRandomEnumValue(room_numbers),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    status: getRandomEnumValue(status),
  }
))

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {   
    await queryInterface.bulkInsert('Patient', patient, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Patient', patient, {});
  }
};
