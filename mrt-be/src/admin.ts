import express from 'express'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';

import { AdminSchema } from '../db/schemas';


const adminRouter = express.Router();
const Admin = mongoose.model('admins', AdminSchema);;

adminRouter.post('/login/admin', async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ 'username':`${username}` });
    
    if (admin && admin.salt) {
        //Password Hashing
        const hash = crypto.pbkdf2Sync(password, admin.salt, 1000, 64, `sha512`).toString('hex');
        if (hash === admin.hash) {
            const key = process.env.SECRET_KEY || '';
            const token = jwt.sign({ username: req.body.username }, key, { expiresIn: '1h' });
            return res.status(200).send({ token: token });
        } else {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    } else {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
  
});

adminRouter.post('/login/admin/register', async (req, res) => {
    const { username, password } = req.body;

    // Create a salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the password with the salt
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex');

    //Mongodb Schema
    const admin = new Admin({
        username,
        salt,
        hash
    });

    //Save to database
    await admin.save();

    res.status(200).json({ message: 'Registration successful' });
});


adminRouter.get('/login/admin', async (req, res) => {
    res.status(200).json({ message: 'Admin' });
})

export default adminRouter;
