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

routes.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = req.db;

    const updateResult = await db.collection("products").updateOne(
      { id: id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          category: req.body.category,
          description: req.body.description,
          image: req.body.image,
          quantity: req.body.quantity
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).send("Product not found.");
    }

    res.send("Product updated successfully.");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("An error occurred while updating the product.");
  }
});


export default routes;