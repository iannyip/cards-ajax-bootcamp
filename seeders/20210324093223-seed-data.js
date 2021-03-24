module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userList = [
      {
        email: 'kai@gmail.com',
        password: 'kaipassword',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'akira@gmail.com',
        password: 'akirapassword',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert('users', userList);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
