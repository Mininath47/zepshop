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
router.get("/login/:userid/:password", async (req, res) => {
  const { userid, password } = req.params;

  try {
    const db = req.db;
    const users = db.collection("users");

    const user = await users.findOne({ userid, password });

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