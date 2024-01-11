import express from 'express'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import session from 'express-session'
import bcrypt from 'bcrypt'

import { AdminSchema } from '../db/schemas';


const adminRouter = express.Router();
const Admin = mongoose.model('admins', AdminSchema);



adminRouter.post('/login/admin', async (req, res) => {
    const { username, password } = req.body;

    //Mongodb query to check if the username correct
    const admin = await Admin.findOne({ 'username':`${username}`});

    if (admin && await bcrypt.compare(password, admin.password)) {
        return res.status(200).json({ message: 'Login successful'});
    } else {
        return res.status(400).json({ message: 'Invalid username or password' });

    }


    // if (!admin) {
    //   return res.status(400).json({ message: 'Invalid username or password' });
    // } else {
        


    //     return res.status(200).json({ message: 'Login successful'});
    // }
  
});

adminRouter.post('/register/admin', async (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();
});



export default adminRouter;
;