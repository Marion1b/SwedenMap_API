'use strict';

const { PrimaryKey } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users-friends',{
      userId:{
        type:Sequelize.INTEGER,
        PrimaryKey:true,
        references:{
          model:'users',
          key:'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull:false
      },
      friendId:{
        type:Sequelize.INTEGER,
        PrimaryKey: true,
        references:{
          model:'users',
          key:'userId'
        },
        onUpdate:'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull:false
      },
      updtatedAt:{
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users-friends');
  }
};
