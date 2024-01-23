import express from 'express'
import mongoose from 'mongoose'

import { CardSchema } from '../db/schemas';

const cardRouter = express.Router();
const Card = mongoose.model('cards', CardSchema);

cardRouter.get('/cards/get', async (req, res) => {
    const cards = await Card.find({});
    res.status(200).json(cards);
})

cardRouter.delete('/cards/delete', async (req, res) => {
    const { uuid } = req.body;
    //Make sure to ask if they are sure to delete
    await Card.deleteOne({ 'uuid': `${uuid}` }); 
    res.status(200).json({ message: 'Card deleted' });
});

cardRouter.post('/cards/add', async (req, res) => {
    const { balance } = req.body;

    //Generate UUID
    const uuid = Math.floor(Math.random() * 1000000000);
    const tappedIn = false, tappedOut = false;
    const card = new Card({
        uuid,
        balance,
        tappedIn,
        tappedOut
    });

    await card.save();

    res.status(200).json({ message: 'Card added' });
});

export default cardRouter;