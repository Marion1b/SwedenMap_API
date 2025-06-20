import sequelizeConnection from './database';
import express, { Express, Request, Response } from 'express';
import registerRoutes from './routes';
import { UserService } from './components/user/UserService';

const app = express();

//check if connection with database is ok
async function assertDatabaseConnection() {
  console.log(`Checking database connection...`)
  try {
    await sequelizeConnection.authenticate()
    console.log('Database connection OK!')
  } catch (error) {
    console.log('Unable to connect to the database:')
    console.log((error as Error).message)
    process.exit(1)
  }
}

assertDatabaseConnection();

console.log(registerRoutes());
const user = new UserService();
console.log(user.getAll());
console.log('jufds')

app.listen(8080);