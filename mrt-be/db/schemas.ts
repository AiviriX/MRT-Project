import { Schema } from 'mongoose';

export const CardSchema = new Schema({
    uuid: String,
    balance: Number,
    tappedIn: Boolean,
    sourceStation: String,
})

export const StationSchema = new Schema({
    stationName: String,
    coordinates: [Number]
})

export const UserSchema = new Schema({
    username: String,
    password: String,
    email: String
})

export const AdminSchema = new Schema({
    username: String,
    salt: String, 
    password: String,
    hash: String,
    role: String
})

export default null