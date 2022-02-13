const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors =require('cors')
const port =process.env.PORT|| 5000
require('dotenv').config()
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.sm9ey.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello !')
})



async function run() {


    try {
await client.connect();
const database = client.db('nicheDB');
const productsCollection = database.collection('products');
const orderCollection =database.collection('order')
const userCollection =database.collection('user')
const reviewsCollection =database.collection('review')
//get api
app.get('/products', async(req, res)=>{
const cursor = productsCollection.find({});
const products =await cursor.toArray();
res.send(products);
})
app.get('/reviews', async(req, res)=>{
const cursor = reviewsCollection.find({});
const review =await cursor.toArray();
res.send(review);
})
app.get('/orders', async(req, res)=>{
const cursor = orderCollection.find({});
const order =await cursor.toArray();
res.send(order);
})
app.get('/users/:email', async (req, res) => {
const email = req.params.email;
const query = { email: email };
const user = await userCollection.findOne(query);
let isAdmin = false;
if (user?.role === 'admin') {
    isAdmin = true;
}
res.json({ admin: isAdmin });
})


//post api
app.post('/products', async(req, res) => {
const product =req.body;
const result =await productsCollection.insertOne(product);
res.json(result);
})
app.post('/reviews', async(req, res) => {
const review =req.body;
const result =await reviewsCollection.insertOne(review);
res.json(result);
})

app.post('/orders',async(req, res)=>{
const order =req.body;
const result =await orderCollection.insertOne(order)
res.json(result)
}  )
app.post('/users',async(req, res)=>{
const user =req.body;
const result =await userCollection.insertOne(user)
res.json(result)
}  )
app.put('/users', async (req, res) => {
const user = req.body;
const filter = { email: user.email };
const options = { upsert: true };
const updateDoc = { $set: user };
const result = await userCollection.updateOne(filter, updateDoc, options);
res.json(result);
});

app.put('/users/admin', async(req,res)=>{
   const user=req.body
   const filter ={email: user.email}
   const updateDoc={$set: {role:'admin'}}
   const result = await userCollection.updateOne(filter, updateDoc)
   res.json(result)
})
  
}
finally {
    // await client.close();
  } 
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(` listening on port ${port}`)
})