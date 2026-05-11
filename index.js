const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

app.use(cors());
app.use(express.json());


// tea_tales
// JfMQHpn9TqwX3iea



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skmy7gb.mongodb.net/?appName=Cluster0`

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
    await client.connect();

    const teaCollection = client.db('teaDB').collection('teas');
    const usersCollection = client.db('teaDB').collection('users');


    // send data to database
    app.post('/teas', async(req, res) =>{
        const newTea = req.body;
        console.log(newTea);
        const result = await teaCollection.insertOne(newTea);
        res.send(result);
    })

    //find data from database
    app.get('/teas', async(req, res) =>{
        const result = await teaCollection.find().toArray();
        res.send(result);
    })

    //update data from database
    app.put('/teas/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateTea = req.body;
      const updateDoc = {
        $set: updateTea
      }
      const result = await teaCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    //view tea on db
    app.get('/teas/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await teaCollection.findOne(query);
      res.send(result);
    })

    //delete data from database
    app.delete('/teas/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await teaCollection.deleteOne(query);
      res.send(result);
    })


    //user related APIs
    app.post('/users', async(req, res) =>{
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    })

    app.get('/users', async(req, res) =>{
      const result = await usersCollection.find().toArray();
      res.send(result);
    })


    app.patch('/users', async(req, res) =>{
      const {email, lastSignInTime} = req.body;
      const filter = {email: email}
      const updateDoc = {
        $set: {
          lastSignInTime: lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('tea is getting warmer')
})

app.listen(port, () => {
  console.log(`Tea server is running on port ${port}`)
})
