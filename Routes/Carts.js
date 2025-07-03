import express from "express";
import { Db } from "mongodb";

const router = express.Router();

router.get("/carts", async (req,res)=>{
const db = req.db;
const cartsColl = await db.collection("carts").find().toArray();
res.send(cartsColl);
res.end();
});
router.get("/carts/:emailid", async (req,res)=>{
const db = req.db;
const cartsColl = await db.collection("carts").find({email:req.params.emailid}).toArray();
res.send(cartsColl);
res.end();
});

router.post("/carts", async (req,res)=>{
const db = req.db;
const {id,title,price,category,image,quantity,description} = req.body;
const cartsColl = await db.collection("carts").insertOne(
    {
  id,
  title, 
  price,
  category,
  image,
  quantity,
  description
}
);
res.send("Carts Products add..");
res.end()
});

export default router;