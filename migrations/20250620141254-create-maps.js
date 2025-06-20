'use strict';

const { AutoIncrement } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('maps',{
      mapId:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name:{
        type:Sequelize.STRING(255),
        allowNull: false
      },
      creatorId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      country:{
        type: Sequelize.STRING(255),
        allowNull: false
      },
      city:{
        type: Sequelize.STRING(255),
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull:false
      },
      updatedAt:{
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('maps');
  }
};
