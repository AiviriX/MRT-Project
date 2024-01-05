//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';


import { StationSchema } from '../db/schemas';

dotenv.config();

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI || '');
const Stations = mongoose.model('mrt-3', StationSchema);

const startServer = (app: express.Express) => {
  //Listing to the app and running it on PORT 
  app.listen(PORT, async () => {
      console.log(`listening on port ${PORT}`)
  })

  // //Get request to display stations
  // app.get("/", async (req, res) => {
  //     try {
  //       const data = await Stations.find({});
  //       res.json(data);
  //       res.status(200);
  //     } catch (err) {
  //       console.error(err);
  //       res.status(500).json({ message: "Error connecting to db", err });
  //     }
  // });

  app.get("/stations/:stationName", async (req, res) => {
    try {
      const param = encodeURIComponent(req.params.stationName);
      const data = await Stations.find({ name: param });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error connecting to db", err });
    }
  });




  
}

export default startServer;
