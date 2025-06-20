'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users-saved-maps',{
      userId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        references:{
          model:'users',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull:false
      },
      mapId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        references:{
          model:'maps',
          key:'mapId'
        },
        onUpdate:'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('users-saved-maps');
  }
};
