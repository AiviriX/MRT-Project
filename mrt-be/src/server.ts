//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';


import { StationSchema, AdminSchema } from '../db/schemas';

dotenv.config();

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI || '');
const Stations = mongoose.model('mrt-3', StationSchema);

const startServer = (app: express.Express) => {
  //Listing to the app and running it on PORT 
  app.listen(PORT, async () => {
      console.log(`listening on port ${PORT}`)
  })



  //Get request to display stations
  app.get("/stations", async (req, res) => {
    const data = await Stations.find({  });
    res.json(data);
    res.status(200);
  });

  

  // app.get("/stations/", async (req, res) => {
  //   try {
  //     // const param = encodeURIComponent(req.params.stationName);
  //     const data = await Stations.find({  });
  //     res.json(data);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Error connecting to db", err });
  //   }
  // });


  const Admin = mongoose.model('admins', AdminSchema);
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ 'username':`${username}`, 'password':`${password}` });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  
    res.json({ message: 'Login successful' });
  });

  // app.get('/login', async (req, res) => {
  //   const admin = await Admin.find({});

  //   if (!admin) {
  //     return res.status(400).json({ message: 'Invalid username or password' });
  //   }

  //   res.json(admin)
  // });


  app.get('/stations/add', (req, res) => {
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
