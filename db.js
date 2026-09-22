import mongoose from "mongoose";
import "dotenv/config";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected' ,() => {
    console.log("Connected to Mongodb server")
});

db.on('error', (error) => {
      console.log(error)
});

db.on('disconnected' , () => {
    console.log("MongoDb disconnected")
});

export {db};