import sequelizeConnection from './database';
import express, { Express, Request, Response } from 'express';
import registerRoutes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus:200
};
console.log(`Launching app`);

const app:Express = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

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

async function init(){
  await assertDatabaseConnection();

  console.log(`Starting API on port ${PORT}`);

  app.listen(PORT, ()=>{
    console.log(`API started and listening on port ${PORT}`);
  })
}

app.use(express.json());

app.get('/', (req, res)=>{
  res.send('Hello World!')
})

const PORT = process.env.APP_PORT || 8080;

const router = registerRoutes();
app.use( router);

init();

app.listen(PORT);