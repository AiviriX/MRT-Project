import express from 'express'
import mongoose from 'mongoose'
import crypto from 'crypto';

import { CardSchema } from '../db/schemas';

const cardRouter = express.Router();
const Card = mongoose.model('cards', CardSchema);

cardRouter.get('/cards/get', async (req, res) => {
    const cards = await Card.find({});  
    res.status(200).json(cards);
})

cardRouter.post('cards/tapIn', async (req, res) => {
    const { uuid, sourceStation } = req.body;
    if (uuid === undefined || sourceStation === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}`, sourceStation: `${sourceStation}` });
    } else {
        await Card.updateOne({ uuid }, { tappedIn: true, sourceStation });
        res.status(200).json({ message: `Tapped in ${uuid} at ${sourceStation}` });
    }
});

cardRouter.post('cards/tapOut', async (req, res) => {
    const { uuid, destinationStation } = req.body;
    if (uuid === undefined || destinationStation === undefined) {
        return res.status(400).json({ message: 'Please fill in all fields', uuid: `${uuid}`, destinationStation: `${destinationStation}` });
    } else {
        //calculateDistance
        // const card = await Card.findOne({ uuid });
        // const fare = card.calculateFare(destinationStation);
        // const balance = card.balance - fare;
        // await Card.updateOne({ uuid }, { tappedIn: false, balance });
        // res.status(200).json({ message: `Tapped out ${uuid} at ${destinationStation}. Fare: ${fare}` });
    }
});

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