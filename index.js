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


app.listen(process.env.PORT || port)




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

  const productsCollection = client.db("organicdb").collection("products");
  const ordersCollection = client.db("organicdb").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/product/:id', (req, res) => {
        productsCollection.find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })


    app.delete('/delete/:id', (req, res)=>{
        productsCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
        .then((err, documents) => {
            res.send(!!documents.value)
        })
    })

  
  app.get('/', (req, res) => {
    res.send("Server waiting");
  })


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })


    app.get('/orders', (req, res) => {
        ordersCollection.find({email: req.query.email})
        .toArray((err, documents ) => {
            res.send(documents);
        })
    })

    // app.get('/order/?email', (req, res) => {
    //     ordersCollection.find({ email: req.query.email })
    //     .toArray((err, documents) => {
    //         res.send(documents[0]);
    //     })
    // })
    // app.get('order', (req, res) => {
    //     ordersCollection.find({})
    //     .toArray((err, documents) => {
    //         res.send(documents[0])
    //     })
    // })

});
