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

export default cardRouter;