const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyncv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run =async () =>{
    try{
        await client.connect()
        console.log("connected");
        const emaJohnDb = client.db(process.env.DB_NAME)
        const Products = emaJohnDb.collection("products")
        const order = emaJohnDb.collection("order ")

    app.get('/products', async(req, res) => {
        const query = req.query;
        const finding = Products.find({})
        const numberOfProduct = await finding.count()
        let allProducts;
        if(query.active){
            const pageLimit = query.pageLimit;
            const activePage = query.active;
            const skipping = activePage * pageLimit; 
            allProducts = await finding.skip(skipping).limit(10).toArray()
            console.log(allProducts);
            
        }
        else{
            allProducts = await finding.limit(10).toArray()
        }
             
    res.send({
                numberOfProduct,
                allProducts
            
        })
        
    })

    app.post("/products/finds", async(req, res)=>{
        const keys = (req.body)
        const query = {key: { $in: keys}}
        const result = Products.find(query)
        const resultArray = (await result.toArray())
        res.send(resultArray)
        
    })
    app.post("/submit", async(req, res)=>{
        const body = (req.body)
        const result =await order.insertOne(body)
        res.json(result)
        console.log(result);
        
    })
        
    }
    finally{
        // client.close();
    }
}

run().catch(err => console.log(err)
)

app.get('/', (req, res)=>{
    res.send("Welcome to ema-john-server")
})

app.listen(port , ()=>{
    console.log("listening from port", port);
    
})