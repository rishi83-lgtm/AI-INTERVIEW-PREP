import mongoose from 'mongoose';
export async function connectDatabase(){if(!process.env.MONGO_URI)throw new Error('MONGO_URI is not configured');mongoose.connection.on('error',err=>console.error('MongoDB connection error:',err.message));await mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS:5000});console.log(`MongoDB Connected Successfully: ${mongoose.connection.host}`)}
