const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.igno3bw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // database collection name
    const productCollection = client.db('carHub').collection('products');
    const cartProductCollection = client.db('carHub').collection('cartProduct');

    // to get all product
    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // to post or insert product to database
    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // to get cart product
    app.get('/cartProduct', async (req, res) => {
      const cursor = cartProductCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // to post or insert cart product to database
    app.post('/cartProduct', async (req, res) => {
      const newCartProduct = req.body;
      const result = await cartProductCollection.insertOne(newCartProduct);
      res.send(result);
    });

    // to get single product by _id for edit (start)
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    // to post product by _id
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          description: updateProduct.description,
          rating: updateProduct.rating,
          photo: updateProduct.photo,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    // to delete by id from database
    app.delete('/cartProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartProductCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Prestige Car Hub Server is Running');
});

app.listen(port, () => {
  console.log(`Prestige Car Hub Server is Running on Port: ${port}`);
});
