'use strict';

const sequelize = require('sequelize');
const { ForeignKey } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('maps',{
      fields:['creatorId'],
      type: 'foreign key',
      name:'link_map_to_its_creator',
      references:{
        table:'users',
        field:'userId'
      },
      onDelete:'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('pins',{
      fields: ["geolocId"],
      type: 'foreign key',
      name: 'link_pin_to_its_geoloc',
      references:{
        table:'geolocs',
        field:'geolocId'
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE'
    });

    await queryInterface.addConstraint('pins',{
      fields:["mapId"],
      type: 'foreign key',
      name:'link_pin_to_its_map',
      references:{
        table:'maps',
        field:'mapId'
      },
      onUpdate:'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('pins', {
      fields: ["userId"],
      type: 'foreign key',
      name:'link_pin_to_its_user',
      references:{
        table:'users',
        field:'userId'
      },
      onUpdate:'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('maps', 'link_map_to_its_creator');

    await queryInterface.removeConstraint('pins','link_pin_to_its_geoloc');

    await queryInterface.removeConstraint('pins','link_pin_to_its_map');

    await queryInterface.removeConstraint('pins', 'link_pin_to_its_user');
  }
};
