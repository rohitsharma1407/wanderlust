const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');

const MONGO_URI = 'mongodb://127.0.0.1:27017/mydatabase'; 

main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

async function main() {
    await mongoose.connect(MONGO_URI);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// index route

app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//new route 

app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs");
});

// show route
// app.get('/listings/:id', async (req, res) => {
//     const { id } = req.params;
//     const listings = await Listing.findById(id);
//     res.render("listings/new.ejs");
// });

app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid Listing ID');
    }
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        res.render("listings/show.ejs", { listing });
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).send('Internal Server Error');
    }
});



// create route
app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
});

// app.get('/testListings', async(req, res) => {
//     let sampleListing = new Listing({
//         title: 'Sample Listing',
//         description: 'This is a sample listing.',
//         image: {
//             filename: 'sample.jpg',
//             url: 'http://example.com/sample.jpg'},
//         price: 100,
//         location: 'Sample Location',
//         country: 'Sample Country'
//     });
//     await sampleListing.save();
//     console.log('Sample listing created:');
//     res.send('Sample listing created!');
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});