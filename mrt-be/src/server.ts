//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session'
import { StationSchema, AdminSchema } from '../db/schemas';

import adminRouter from './admin';
import cardRouter from './cards';
import { fareRouter, stationRouter, StationModel } from './stations';

dotenv.config();

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI || '');

const startServer = (app: express.Express) => {
  app.use("/", adminRouter);
  app.use("/", cardRouter)
  app.use("/", fareRouter)
  app.use("/", stationRouter)
  
  app.use(session({
    secret: process.env.SECRET_KEY || '',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));


  //Listing to the app and running it on PORT 
  app.listen(PORT, async () => {
      console.log(`listening on port ${PORT}`)
  })



  //Get request to display stations
  app.get("/stations", async (req, res) => {
    const data = await StationModel.find({  });
    res.json(data);
    res.status(200);
  });


  app.get('/stations/debug', (req, res) => {
    const stationName = 'kamuning'
    const coordinates = '[14.6333, 121.0333]'
    

    res.send(
    [
      {
        stationName: stationName,
        coordinates: coordinates
      }
    ]
    ).status(200);
    res.send('Hello World!')
  }
  )  
}

export default startServer;
