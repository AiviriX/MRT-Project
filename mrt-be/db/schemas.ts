import { Schema } from 'mongoose';

export const CardSchema = new Schema({
    uuid: Number,
    balance: Number,
    tappedIn: Boolean,
    sourceStation: String,
    sourceStationName: String,
    coordinates:[Number]
})

export const StationSchema = new Schema({
    stationName: String,
    coordinates: [Number],
    connectedStation: []
})

export const MRT3Schema = new Schema({
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

export const FareSchema = new Schema({
    farePerKm: Number,
})

export default null