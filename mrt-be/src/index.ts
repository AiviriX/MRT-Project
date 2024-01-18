import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import startServer from './server';
import { establishConnection } from '../db/conn';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000
//import startServer from 'server';

//App Varaibles 
dotenv.config();
//intializing the express app 
const app = express(); 

//using the dependencies
app.use(helmet()); 
app.use(cors()); 
app.use(express.json())
app.use(cookieParser())

//Establishing connection to the database
establishConnection().then((connection) => {
  console.log('Connected to database')
  startServer(app);
}).catch((err) => {
  console.log(err)
})