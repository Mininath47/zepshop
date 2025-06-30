import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoConnect } from "./config/MongoDB.js";
import productsdata from "./Routes/Products.js";
import categoriesdata from "./Routes/Categories.js";
import register from "./Routes/Register.js";
import carts from "./Routes/Carts.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;
const db = await MongoConnect();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));
app.use((req,res,next)=>{
  req.db = db;
  next()
});
app.use("/images", express.static("./images"));

app.use("/", productsdata);
app.use("/",categoriesdata);
app.use("/",register);
app.use("/",carts);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});