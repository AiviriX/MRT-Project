import express from "express";
import { FareSchema, StationSchema } from "../db/schemas"

import mongoose from "mongoose"
import { stat } from "fs";


export const fareRouter = express.Router();
export const stationRouter = express.Router();
export const StationModel = mongoose.model('mrt-3', StationSchema);

export const Fare = mongoose.model('fares', FareSchema);

fareRouter.put('/stations/setFare', async (req, res) => {
    const { fare } = req.body;
    
    let updatedFare = await Fare.findOneAndUpdate({}, { farePerKm: fare }, { new: true });

    if (!updatedFare) {
        updatedFare = new Fare({ farePerKm: fare });
        await updatedFare.save();
    }

    console.log(`Fare updated to ${fare}`)
    res.status(200).json({ message: `Fare updated to ${fare}` });
});


fareRouter.get('/stations/getFare', async (req, res) => {   
    const fare = await Fare.find({});
    res.status(200).json(fare);
});

stationRouter.post('/stations/add', async (req, res) => {
    const { stationName, coordinates, connectedStation } = req.body;
    if (stationName === undefined || coordinates === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', stationName: `${stationName}`, coordinates: `${coordinates}` });
    } else {
        const station = new StationModel({
            stationName,
            coordinates,
            connectedStation
        });
        await station.save();
        res.status(200).json({ message: `Station Added ${stationName}, ${coordinates}` });
    }
});

stationRouter.get('/stations/get/:trainline', async (req, res) => {
    const trainline = req.params.trainline;
    const stations = mongoose.model(trainline.toLowerCase(), StationSchema);
    const x = await stations.find({})

    if (x.length === 0) {
        return res.status(400).json({ message: `No stations found for ${trainline}`});
    } else {
        res.status(200).json(x);
    }
});

stationRouter.get('/stations/getconnection/:stationId', async (req, res) => {
    const stationId = req.params.stationId;
    const station = await StationModel.findById(stationId);
    if (!station) {
        return res.status(400).json({ message: `No station found with id ${stationId}`});
    } else {
        res.status(200).json(station.connectedStation);
        
    }
});

stationRouter.delete('/stations/delete', async (req, res) => {
    const stationName = req.body.stationName;
    const deletedStation = await StationModel.deleteOne({ stationName });
    if (!deletedStation) {
        return res.status(400).json({ message: `No station found with name ${stationName}`});
    } else {
        res.status(200).json({ message: `Deleted ${stationName}` });
    }
}
)

stationRouter.put('/stations/update', async (req, res) => {
    const { stationId, stationName, coordinates, connectedStation } = req.body;

    // Iterate through connected stations
    for (const connectedId of connectedStation) {
        // Check if connected station exists
        const existingStation = await StationModel.findById(connectedId);
        if (!existingStation) {
            // If connected station does not exist, remove it from the array
            const index = connectedStation.indexOf(connectedId);
            if (index > -1) {
                connectedStation.splice(index, 1);
            }
        } else {
            // If connected station exists, ensure bidirectional connection
            if (!existingStation.connectedStation.includes(stationId)) {
                existingStation.connectedStation.push(stationId);
                await existingStation.save();
            }
        }
    }

    // Update the station
    const updatedStation = await StationModel.findOneAndUpdate(
        { _id: stationId }, 
        { stationName, coordinates, connectedStation }, 
        { new: true }
    );

    if (!updatedStation) {
        return res.status(400).json({ message: `No station found with id ${stationId}`});
    } else {
        res.status(200).json({ message: `Updated station with id ${stationId} to ${stationName}, ${coordinates}` });
    }
});



stationRouter.put('/stations/update', async (req, res) => {
    const { stationId, stationName, coordinates, connectedStations:[{}] } = req.body.stationId;
    // Find the station by its ID
    const station = await StationModel.findById(stationId);
    if (!station) {
        return res.status(404).json({ message: 'Station not found' });
    }
    const updatedStation = await station.save();
    res.status(200).json(updatedStation);
});

stationRouter.get('/stations/getone/:stationId', async (req, res) => {
    const stationId = req.params.stationId;
    const station = await StationModel.findById(stationId);
    if (!station) {
        return res.status(400).json({ message: `No station found with id ${stationId}`});
    } else {
        res.status(200).json(station);
    }
});
