const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URI = 'mongodb://127.0.0.1:27017/mydatabase'; 

main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(err)
});

async function main() {
    await mongoose.connect(MONGO_URI);
}

const initDB = async () => {
    await Listing.deleteMany({});
    data.data = data.data.map((obj) =>( {
       ...obj, owner: "667e5e952983ec35f8218645",
    }))
    await Listing.insertMany(data.data);
    console.log("Database initialized with sample data.");

}

initDB();

