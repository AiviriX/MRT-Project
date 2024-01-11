import express from 'express'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';


import { AdminSchema } from '../db/schemas';


const adminRouter = express.Router();
const Admin = mongoose.model('admins', AdminSchema);

const JWT_SECRET = 'meowmeowmeow'


adminRouter.post('/login/admin', async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ 'username':`${username}` });
    
    if (admin && admin.salt) {
        const hash = crypto.pbkdf2Sync(password, admin.salt, 1000, 64, `sha512`).toString('hex');

        if (hash === admin.hash) {
            console.log('Login successful');
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(404).json({ message: 'Invalid username or password' });
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

export default adminRouter;
