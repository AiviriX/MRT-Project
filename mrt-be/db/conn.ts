import mongoose from "mongoose"
import * as dotenv from 'dotenv'
import { MongoClient } from 'mongodb';

dotenv.config();
const uri: string = process.env.MONGODB_URI || '';
let connection: typeof mongoose | undefined;

export const establishConnection = async () => {
    connection = await mongoose.connect(uri);
    return connection;
}

