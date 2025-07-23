'use strict';

const { type } = require('os');
const { AutoIncrement } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users',{
      userId:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
      },
      username:{
        type:Sequelize.STRING(50),
        allowNull: false
      },
      password:{
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email:{
        type: Sequelize.STRING(255),
        allowNull:false
      },
      avatar:{
        type:Sequelize.STRING
      },
      country:{
        type: Sequelize.STRING
      },
      city:{
        type:Sequelize.STRING
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
    await queryInterface.dropTable('users');
  }
};
