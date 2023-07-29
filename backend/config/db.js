import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MongoURI);
        console.log('Mongodb connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;