import mongoose from "mongoose";

const Stats = new mongoose.Schema({
    loginAttempts:{
        type: Number,
         default: 0,
         ref:"User"
    },

    














})