// import the express framework
import express from 'express';
import path from 'path';

var MongoClient = require('mongodb').MongoClient;
// NEW
let MongoCl = require('mongodb').MongoClient;
var url = "mongodb+srv://cooluser:marta123456789@cluster0.sbchk.mongodb.net/web-dev-project?retryWrites=true&w=majority";

// create app object
const app = express();
const port = 8000
app.use(express.json());

// serve the assets directory whenever a request is received on the /images router
app.use('/images', express.static(path.join(__dirname, '../assets'))); 

// endpoint to view all lessons
app.get('/lessons', async (req, res) => {
    const client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('web-dev-project');
    const lessons = await db.collection('lessons').find({}).toArray();
    res.status(200).json(lessons);
    client.close();
});

// endpoint to view all orders
app.get('/orders', async (req, res) => {
    const client = await MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('web-dev-project');
    const orders = await db.collection('orders').find({}).toArray();  
    res.status(200).json(orders);
    client.close();
});

app.post('/orders', (req, res) => {
    MongoCl.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db('web-dev-project');
        dbo.collection('orders').insertOne({
            id: req.body.id,
            spaces: req.body.spaces,
            name: req.body.name,
            number: req.body.number,
        }, 
        function(err) {
            if (err) throw err;
            res.sendStatus(200);
            db.close();
        });
    });
});


app.put('/lessons/update-lesson',async (req, res) => {
    // initiate DB connection
    const client = await MongoClient.connect(
        url,
      { useNewUrlParser: true, useUnifiedTopology: true }  );
    const db = client.db('web-dev-project');
    const lesson = await db.collection('lessons').updateOne(
    {id: req.body.id }, 
    {$set: req.body});
    res.sendStatus(200);
    client.close();
});




app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})