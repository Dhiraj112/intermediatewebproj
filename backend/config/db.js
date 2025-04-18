import mongoose from 'mongoose';

export const conectDB = async () => {
    try {
        const con=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected:${con.connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}