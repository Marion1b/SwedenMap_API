import { Dialect, Sequelize } from 'sequelize';
import connection from "./config";

const { database, user, password, host, logging } = connection;

const sequelizeConnection = new Sequelize(database,user, password, {
    host, 
    logging:logging,
    dialect: 'postgres' as Dialect,
});

export default sequelizeConnection;