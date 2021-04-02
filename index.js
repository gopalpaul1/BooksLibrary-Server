const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5045;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5mhw5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.listen(port)




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("organicdb").collection("products");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {

            res.send(result.insertedCount > 0)

        })
    })


    app.get('/products', (req, res) => {
        productsCollection.find()
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/product/:id', (req, res) => {
        productsCollection.find({id: req.params.id})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.delete('/delete/:id', (req, res)=>{
        productsCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((err, result) => {
            console.log(result)
        })
    })

});
