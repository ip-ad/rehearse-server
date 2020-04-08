const express = require('express');
const mongodb = require('mongodb');
require('dotenv').config();

const router = express.Router();

// Get Entries
router.get('/', async (req, res) => {
    const entries = await loadEntriesCollection();
    res.send(await entries.find({}).toArray());
});

// Add post
router.post('/', async (req, res) => {
    const entries = await loadEntriesCollection();
    await entries.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });

    res.status(201).send();
});

// Delete Post
router.delete('/:id', async (req, res) => {
    const entries = await loadEntriesCollection();
    await entries.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});


async function loadEntriesCollection() {
    const client = await mongodb.MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return client.db(process.env.MONGODB_DBNAME).collection('entries');
}

module.exports = router;