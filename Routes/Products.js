import express, { json } from "express";
import { Db } from "mongodb";
const routes = express.Router();
routes.use(express.json());

 routes.get("/products", async (req,res)=>{
    const db   =  req.db;
  const product = await db.collection("products").find().toArray();
  res.send(product)
});

export default routes;