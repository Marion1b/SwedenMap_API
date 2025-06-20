'use strict';

const { type } = require('os');
const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('pins',{
      pinId:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name:{
        type: Sequelize.STRING(255),
        allowNull:false
      },
      description:{
        type:Sequelize.STRING(800),
        allowNull: false
      },
      photo:{
        type:Sequelize.STRING(800)
      },
      category:{
        type: Sequelize.STRING(100),
        allowNull: false
      },
      geolocId:{
        type: sequelize.INTEGER,
        allowNull:false
      },
      mapId:{
        type: sequelize.INTEGER,
        allowNull: false
      },
      userId:{
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('pins');
  }
};
