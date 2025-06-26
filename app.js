import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoConnect } from "./MongoDB.js";
import productsdata from "./Routes/Products.js";
import categoriesdata from "./Routes/Categories.js";
import register from "./Routes/Register.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;
const db = await MongoConnect();
app.use((req,res,next)=>{
  req.db = db;
  next()
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", productsdata);
app.use("/",categoriesdata);
app.use("/",register)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});