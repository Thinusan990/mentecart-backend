import mongoose from "mongoose";

export async function connectDB(uri: string){
    try {
        await mongoose.connect(uri);
        console.log("MongoDb Connected");
    } catch (error) {
        console.error(error)
        process.exit(1);
    }
}