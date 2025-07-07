import express from "express";
import { Db } from "mongodb";

const router = express.Router();


router.get("/profiles", async (req,res)=>{
const db = req.db;
const cartsColl = await db.collection("profiles").find().toArray();
res.send(cartsColl);
res.end();
});

export default router;