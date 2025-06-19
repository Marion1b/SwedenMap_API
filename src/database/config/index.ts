import path from 'path';
import { config } from 'dotenv';
import { resolve } from 'path';


config({path: resolve(process.cwd(), '.env.dev')});

type DbConnection = {
    host: string;
    port:number;
    user:string;
    password:string;
    database:string;
    logging: boolean;
}

const connection : DbConnection = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
}

export default connection;