const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qbh9oi5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const recipeCollection = client.db('unique-recipe').collection('recipe');
        // const orderCollection = client.db('geniousCar').collection('orders');
        
        app.get('/recipes', async (req, res) => {
            const query = {};
            const cursor = recipeCollection.find(query);
            const recipe = await cursor.toArray();
            res.send(recipe);
        });

        app.get('/recipe', async (req, res) => {
            const query = {};
            const cursor = recipeCollection.find(query);
            const recipe = await cursor.limit(3).toArray();
            res.send(recipe);
        });

        app.get('/recipes/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const recipeDetails = await recipeCollection.findOne(query);
            res.send(recipeDetails);
        });
    }
    finally {

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Unique Recipe Server is running');
});

app.listen(port, () => {
    console.log(`Unique Recipe Server running on ${port}`);
})