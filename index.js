const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 7052;
// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pf5eojy.mongodb.net/?retryWrites=true&w=majority`;

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

        // API for instructors and Classes
        const instructorsCollection = client.db("SummerCamp").collection("instructors");
        const usersCollection = client.db("SummerCamp").collection("users");
        const selectedClassCollection = client.db("SummerCamp").collection("selectedClasses");

// -----------------GET----------------------------//
        // Instructors API
        app.get('/instructors', async (req, res) => {
            const result = await instructorsCollection.find().toArray();
            res.send(result);
        })

        // Users API
        app.get('/users',async (req,res) =>{
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        // Selected Classes API

        app.get('/selectedClasses',async(req,res) =>{
            const email = req.query.email;
            console.log(email);
            if(!email){
                res.send([]);
            }
            const query = {email: email};
            const result = await selectedClassCollection.find(query).toArray();
            res.send(result);
        })

//-------------------POST-------------------------//
        // User Database 
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
      
            if (existingUser) {
              return res.send({ message: 'user already exists' })
            }
      
            const result = await usersCollection.insertOne(user);
            res.send(result);
          });

        //   Selected Classes Database
        app.post('/selectedClasses', async (req, res) => {
            const item = req.body;
            const result= await selectedClassCollection.insertOne(item);
            res.send(result);
        })
// ----------------------Delete--------------------//

        // Delete Selected Classes
        

    app.delete('/selectedClasses/:id', async (req, res) => {
        const id = req.params.id;
        const query ={_id: new ObjectId(id)}
        const result = await selectedClassCollection.deleteOne(query);
        res.send(result);
      })

    //   Delete Users
    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query ={_id: new ObjectId(id)}
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
    res.send('Summer is coming...');
})
app.listen(port, () => {
    console.log(`summer is showing on port ${port}`);
})



