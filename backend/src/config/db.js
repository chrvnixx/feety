import mongoose from "mongoose"


export async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("db is now running")
    } catch (error) {
        console.log("error connecting to database")
    }
}