const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qb7mmsc.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    //const elementsCollection = client.db('carDB').collection('car');
    //const userCollection = client.db('carDB').collection('user');

    app.get('/elements', async(req, res) => {
        const cursor = elementsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.get('/elements/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await elementsCollection.findOne(query)
        res.send(result);
    })


    app.post('/elements', async(req, res) => {
        const newElements = req.body;
        console.log(newElements);
        const result = await elementsCollection.insertOne(newElements);
        res.send(result);
    })


    app.put('/elements/:id', async(req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)}
        const options = { upsert: true };
        const updatedElements = req.body;
        const elements = {
            $set: {
                model: updatedElements.model, 
                brand: updatedElements.brand, 
                type: updatedElements.type, 
                price: updatedElements.price, 
                rating: updatedElements.rating, 
                image: updatedElements.image
            }
        };
        try {
            const result = await elementsCollection.updateOne(filter, elements, options);
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });


    // user api
    app.get('/user/:email', async(req, res) => {
        const email = req.params.email;
        const query = {email: email};
        const result = await userCollection.findOne(query);
        res.send(result);
    });


    app.put('/user/:email', async(req, res) => {
        const email = req.params.email;
        const myCart = req.body.myCart;
        const filter = { email: email};
        const options = { upsert: true };
        const updatedUser = req.body;
        const update = {
            $addToSet: {
                myCart: updatedUser.myCart
            }
        };
        try {
            const result = await userCollection.updateOne(filter, update, options);
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });


    app.post('/user', async(req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    });


    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand Shop server is running')
})


app.listen(port, () => {
    console.log(`Brand Shop is running on port: ${port}`)
})

