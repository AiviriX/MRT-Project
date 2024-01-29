import express from "express";
import { FareSchema } from "../db/schemas"
import mongoose from "mongoose"


export const fareRouter = express.Router();
const Fare = mongoose.model('fares', FareSchema);


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

export const stations = () => {
    
}
