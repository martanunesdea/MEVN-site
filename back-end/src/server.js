// import the express framework
import express from 'express';
import bodyParser from 'body-parser';

// create app object
const app = express();
app.use(bodyParser.json()); // parses the json object included in the request body
                            // and adds a body to the request argument for our callbacks
// define different endpoints
app.get('/hello', (req, res) => {
    res.send('Hello!');
})

// add a post request
app.post('/hello', (req, res) => {
    res.send(`Hello ${req.body.name}`);
})

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
})