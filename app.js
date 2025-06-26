import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoConnect } from "./MongoDB.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;

// const mongoURL = "mongodb://localhost:27017";
// const client = new MongoClient(mongoURL);
// await client.connect();

const db = await MongoConnect();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * GET all products
 */

const products = db.collection("products");
const categories = db.collection("categories");

app.get("/products",(req,res)=>{
    products.find().toArray().then((doc)=>{
        res.send(doc);
        res.end();
    });
});
app.get("/categories",(req,res)=>{
    categories.find().toArray().then((doc)=>{
        res.send(doc);
        res.end();
    });
});


app.get("/products/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const productList = await products.find({ category }).toArray();

    if (productList.length === 0) {
      return res.status(404).json({ message: "No products found for this category." });
    }

    res.json(productList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
