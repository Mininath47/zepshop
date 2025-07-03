import express from "express";
import { Db } from "mongodb";

const router = express.Router();

router.post("/register",async (req,res)=>{
    const {userid,username,email,mobile,password} = req.body;
   try{
     const db  = req.db;
    const users =  db.collection("users");
    const userdata = await users.insertOne({userid,username,email,mobile,password});
    res.send("user Added ...");
   }catch(err){
    console.log("user miss");
   }
});
router.get("/login",async (req,res)=>{
  
   try{
     const db  = req.db;
    const users =  db.collection("users");
    const userdata = await users.find().toArray();
    res.send("user Added ...");
   }catch(err){
    console.log("user miss");
   }
});

router.get("/login/:email/:password", async (req, res) => {
  const { username ,mobile,email,password } = req.params;

  try {
    const db = req.db;
    const users = db.collection("users");

    const user = await users.findOne({ email, password });

    if (user) {
      res.status(200).send(user);
    } else { 
      res.status(401).send({ message: "Invalid credentials" });
    }

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ message: "Server error" });
  }
});


export default router;