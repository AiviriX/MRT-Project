import express from 'express'
import mongoose from 'mongoose'
import crypto from 'crypto';

import { CardSchema } from '../db/schemas';
import { StationModel } from '../src/stations';
import { findShortestPath } from '../src/bfs';
const cardRouter = express.Router();
const Card = mongoose.model('cards', CardSchema);

cardRouter.get('/cards/get', async (req, res) => {
    const cards = await Card.find({});  
    res.status(200).json(cards);
})

cardRouter.post('/cards/tap/in', async (req, res) => {
    const { cardData, stationData } = req.body;
    if (cardData === undefined || stationData === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', cardData: `${cardData}`, stationData: `${stationData}` });
    } else {
        const card = await Card.findOne({ uuid: cardData.uuid });
        const station = await StationModel.findOne({ stationName: stationData.stationName });
        if (!card) {
            return res.status(404).json({ message: `Card ${cardData.uuid} does not exist` });
        } 
        
        if (!station) {
            return res.status(404).json({ message: `Station ${stationData.stationName} does not exist` });
        }

        if (!card.tappedIn) {
            await Card.updateOne({ uuid: cardData.uuid }, { tappedIn: true, sourceStation: stationData._id});  
        } else {
            //IF source station same as destination station
            //card is already tapped in
            //else entry mismatch
            return res.status(403).json({ message: `Card ${cardData.uuid} is already tapped in` });
        }

        res.status(201).json({ message: `Tapped in ${cardData.uuid} at ${stationData.stationName}` });
    }
});

cardRouter.post('/cards/tap/out', async (req, res) => {
    const { cardData, stationData } = req.body;
    if (cardData === undefined || stationData === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', cardData: `${cardData}`, stationData: `${stationData}` });
    } else {
        const card = await Card.findOne({ uuid: cardData.uuid });
        const station = await StationModel.findOne({ stationName: stationData.stationName });
        if (!card) {
            return res.status(404).json({ message: `Card ${cardData.uuid} does not exist` });
        } 
        
        if (!station) {
            return res.status(404).json({ message: `Station ${stationData.stationName} does not exist` });
        }

        if (card.tappedIn) {
            if (card.sourceStation && station._id) {
                const path = await findShortestPath(card.sourceStation, station._id.toString());
                if (path) {
                    console.log(path);
                }
            }

            
            await Card.updateOne({ uuid: cardData.uuid }, { tappedIn: false, sourceStation: '' });  
        } else {

            return res.status(403).json({ message: `Card ${cardData.uuid} is already tapped out` });
        }

        res.status(201).json({ message: `Tapped out ${cardData.uuid} at ${stationData.stationName}` });
    }
}
);


// cardRouter.post('cards/tap/out', async (req, res) => {
//     const { uuid, sourceStation, destinationStation } = req.body;
//     if (uuid === undefined || destinationStation === undefined) {
//         return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}`, destinationStation: `${destinationStation}` });
//     } else {
//         //calculateDistance
//         // const card = await Card.findOne({ uuid });
//         // const fare = card.calculateFare(destinationStation);
//         // const balance = card.balance - fare;
//         // await Card.updateOne({ uuid }, { tappedIn: false, balance });
//         // res.status(200).json({ message: `Tapped out ${uuid} at ${destinationStation}. Fare: ${fare}` });
//     }
// });

cardRouter.get('/cards/getOne', async (req, res) => {
    const uuid = req.query.uuid;
    if (uuid === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}` });
    } else {
        const card = await Card.findOne({ uuid });
        res.status(200).json(card);
    }
});

cardRouter.delete('/cards/delete', async (req, res) => {
    const uuid  = req.query.uuid;
    //Make sure to ask if they are sure to delete
    if (uuid === undefined) {
        return res.status(400).json({ message: 'Unable to delete UUID. Does it exist?' });
    } else {
        await Card.deleteOne({ uuid });
        res.status(200).json({ message: `Deleted ${uuid}` });
    }
});

cardRouter.post('/cards/add', async (req, res) => {
    const  { uuid, balance } = req.body;
    const tappedIn = false;

    if (uuid === undefined || balance === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}`, balance: `${balance}` });
    } else {
        const card = new Card({
            uuid,
            balance,
            tappedIn,
            sourceStation: ''
        });
    await card.save();
    res.status(200).json({ message: `Card Added ${ uuid }, ${balance}` });
    }
});

cardRouter.put('/cards/addBalance', async (req, res) => {
    const { uuid, balance } = req.body;
    if (uuid === undefined || balance === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}`, balance: `${balance}` });
    } else {
        await Card.updateOne({ uuid }, { balance });
        console.log(`Updated ${uuid} to ${balance}`)
        res.status(200).json({ message: `Updated ${uuid} to ${balance}` });
    }
}
);

cardRouter.put('/cards/tapIn', async (req, res) => {
    const { uuid, sourceStation } = req.body;
    if (uuid === undefined || sourceStation === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}`, sourceStation: `${sourceStation}` });
    } else {
        await Card.updateOne({ uuid }, { tappedIn: true, sourceStation });
        res.status(200).json({ message: `Tapped in ${uuid} at ${sourceStation}` });
    }
});

// cardRouter.put('/cards/tapOut', async (req, res) => {
//     const { uuid, destinationStation } = req.body;
//     if (uuid === undefined || destinationStation === undefined) {
//         return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}`, destinationStation: `${destinationStation}` });
//     } else {
//         try {
//             const card = await Card.findOne({ uuid });
//             const fare = card.calculateFare(destinationStation);
//             const balance = card.balance - fare;
//             await Card.updateOne({ uuid }, { tappedIn: false, balance });
//             res.status(200).json({ message: `Tapped out ${uuid} at ${destinationStation}. Fare: ${fare}` });
//         } catch (err) {
//             res.status(400).json({ message: `Error: ${err}` });
//         }
//     } 
// });

export default cardRouter;