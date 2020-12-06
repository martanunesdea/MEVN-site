// import the express framework
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';

// create app object
const app = express();
app.use(bodyParser.json()); // parses the json object included in the request body
                            // and adds a body to the request argument for our callbacks

// serve the assets directory whenever a request is received on the /images router
app.use('/images', express.static(path.join(__dirname, '../assets'))); 

// endpoint to view all products
app.get('/api/products', async (req, res) => {
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const db = client.db('vue-db');
  const products = await db.collection('products').find({}).toArray();  
  res.status(200).json(products);
  client.close();
});

// endpoint to view all products
app.get('/api/orders', async (req, res) => {
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const db = client.db('vue-db');
  const products = await db.collection('orders').find({}).toArray();  
  res.status(200).json(products);
  client.close();
});



// endpoint to view orders with user, phone number
app.get('/api/orders/:name', async (req, res) => {
  const username = req.params;
  //const usernumber = req.params;

  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const db = client.db('vuedb');

  const orders = await db.collection('orders').findOne({name: username});  
  /*if (orders.length == 0)
    return res.status(404).json("Couldn't find order");*/ 

  res.status(200).json(orders);
  client.close();
});


// endpoint for getting orders from user 
app.post('/api/orders/user',async (req, res) => {
  // initiate DB connection
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017/',
    { useNewUrlParser: true, useUnifiedTopology: true }  );
  const db = client.db('vue-db');
  const orders = await db.collection('orders').find({ name: req.body.name, number: req.body.number }).toArray();
  res.status(200).json(orders);
  client.close();
});


// endpoint for adding items to users cart
app.post('/api/orders',async (req, res) => {
  // initiate DB connection
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017/',
    { useNewUrlParser: true, useUnifiedTopology: true }  );
  const db = client.db('vue-db');
  await db.collection('orders').insertOne({ 
   id: req.body.id,
   name: req.body.name,
   number: req.body.number,
   lesson: req.body.lesson,
   spaces: req.body.spaces,
  });

  const order = await db.collection('orders').findOne({ id: req.body.id });
  res.status(200).json(order);
  client.close();
});

// endpoint to view cart products
app.get('/api/users/:userId/cart', async (req, res) => {
  // get userId from URL params
  const { userId } = req.params;

  // initiate DB connection
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const db = client.db('vue-db');

  // find user in the users collection
  const user = await db.collection('users').findOne({ id: userId});
  // ensure this user exists
  if (!user) return res.status(404).json("Couldn't find user");
  
  // get all products
  const products = await db.collection('products').find({}).toArray();
  // get user products
  const cartItemIds = user.cartItems;
  
  // look in the "products" collection for those products with same id as the cart item ids
  const cartItems = cartItemIds.map( id => 
    products.find(product => product.id === id));

  res.status(200).json(cartItems);
  client.close();
});

app.get('/api/orders_new/:id', async (req, res) => {
  const { productId } = req.params;
   
  // initiate DB connection
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const db = client.db('vue-db');

  // retrieve product from database
  const product = await db.collection('orders').findOne({ id: productId });

  // check if there was a match (and if there's anything to return)
  if (product) {
        res.status(200).json(product);
  } else {
        res.status(404).json('Could not find the product!');
  }
  client.close();
})

// endpoint for adding items to users cart
app.post('/api/users/:userId/cart',async (req, res) => {
  // get user from URL parameters
  const { userId } = req.params;
  // pulling this out of request body { productId: '123'}
  const { productId }= req.body;
  // initiate DB connection
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017/'  );
  const db = client.db('vue-db');
  await db.collection('users').updateOne({ id: userId}, {
    $addToSet:  { cartItems: productId },   // adds new product Id without duplicates
  } );
  const user = await db.collection('users').findOne({ id: userId });
   // get all products
   const products = await db.collection('products').find({}).toArray();
  
  const cartItemIds = user.cartItems;
  const cartItems = cartItemIds.map( id =>
    products.find(product => product.id === id));
  res.status(200).json(cartItems);
  client.close();
});

// endpoint for removing items from user cart
app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  // initiate DB connection
  const client = await MongoClient.connect(
    'mongodb://127.0.0.1:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const db = client.db('vue-db');

  // update the user data
  await db.collection('users').updateOne({ id: userId}, {
    $pull: { cartItems: productId },
  });
  // send back updated array of users products
  const user = await db.collection('users').findOne({ id: userId });
  // get all products
  const products = await db.collection('products').find({}).toArray();
  // get ids of products in cart
  const cartItemIds = user.cartItems;
  
  // update the cart items
  const cartItems = cartItemIds.map( id =>
    products.find(product => product.id === id));
    
  res.status(200).json(cartItems);
  client.close()
});
    
app.listen(8000, () => {
    console.log('Server is listening on port 8000');
})