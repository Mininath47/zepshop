import express from "express";
import { Db } from "mongodb";

const router = express.Router();

router.post("/register",async (req,res)=>{
    const {userid,email,mobile,password} = req.body;
   try{
     const db  = req.db;
    const users =  db.collection("users");
    const userdata = await users.insertOne({ userid,email,mobile,password});
    res.send("user Added ...");
   }catch(err){
    console.log("user miss");
   }
});

router.get("/login",async (req,res)=>{
    
   try{
     const db   = req.db;
    const users =  db.collection("users");
    const userdata = await users.find().toArray();
    res.send(userdata);
   }catch(err){
    console.log("user miss");
   }
});

export default router;