'use strict';

const { PrimaryKey } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('geolocs',{
      geolocId:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
      },
      geolocLat:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      geolocLng:{
        type: Sequelize.INTEGER,
        allowNull:false
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
    await queryInterface.dropTable('geolocs');
  }
};
