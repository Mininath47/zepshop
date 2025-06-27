import express, { json } from "express";
import { Db } from "mongodb";
const routes = express.Router();
routes.use(express.json());

 routes.get("/products", async (req,res)=>{
    const db   =  req.db;
  const product = await db.collection("products").find().toArray();
  res.send(product)
});


routes.post("/products", async (req,res)=>{
  const {id,title,price,category,description,image,quantity} = req.body;
  const db =  req.db;
  const product = await db.collection("products").insertOne({
    id,
    title,
    price,
    category,
    description,
    image,
    quantity
  });
  res.send("Products Uplodded .. one !");
  res.end();
})

export default routes;