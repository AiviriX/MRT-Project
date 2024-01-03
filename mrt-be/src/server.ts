//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000


const startServer = (app: express.Express) => {
  //Listing to the app and running it on PORT 5000
  app.listen(PORT, async () => {
      console.log(`listning on port ${PORT}`)
  })

  app.get('/stations/get/:id', (req, res) => {
    const id = req.params.id

    
    res.send(
    [
      {
        id: id,
        name: 'Taft Avenue',
        line: 'L1',
        lat: 14.5378,
        lng: 120.9998
      }
    ]
    ).status(200);
    res.send('Hello World!')
  })


  app.post('/stations/add', (req, res) => {
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
