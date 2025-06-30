import express, { json } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Db } from "mongodb";
const routes = express.Router();
routes.use(express.json());

//  routes.get("/products", async (req,res)=>{
//     const db   =  req.db;
//   const product = await db.collection("products").find().toArray();
//   res.send(product)
// });


// routes.post("/products", async (req,res)=>{
//   const {id,title,price,category,description,image,quantity} = req.body;
//   const db =  req.db;
//   const product = await db.collection("products").insertOne({
//     id,
//     title,
//     price,
//     category,
//     description,
//     image,
//     quantity
//   });
//   res.send("Products Uplodded .. one !");
//   res.end();
// })


// Setup __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../images")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ---------- CREATE (POST) ----------
routes.post("/products", upload.single("image"), async (req, res) => {
  const db = req.db;
  const { id, title, price, category, description, quantity } = req.body;
  const image = req.file ? "images/" + req.file.filename : "";

  const product = {
    id: parseFloat(id),
    title,
    price: parseFloat(price),
    category,
    description,
    quantity: parseInt(quantity),
    image
  };

  try {
    await db.collection("products").insertOne(product);
    res.send("Product created.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create product.");
  }
});

// ---------- READ (GET) ----------
routes.get("/products", async (req, res) => {
  const db = req.db;
  const products = await db.collection("products").find().toArray();
  res.send(products);
});

routes.get("/products/:id", async (req, res) => {
  const db = req.db;
  const product = await db.collection("products").findOne({ id: parseFloat(req.params.id) });
  if (product) res.send(product);
  else res.status(404).send("Product not found.");
});

// ---------- UPDATE (PUT = full replace) ----------
routes.put("/products/:id", upload.single("image"), async (req, res) => {
  const db = req.db;
  const { title, price, category, description, quantity } = req.body;
  const image = req.file ? "images/" + req.file.filename : undefined;

  const updateData = {
    title,
    price: parseFloat(price),
    category,
    description,
    quantity: parseInt(quantity)
  };
  if (image) updateData.image = image;

  const result = await db.collection("products").updateOne(
    { id: parseFloat(req.params.id) },
    { $set: updateData }
  );

  res.send(result.modifiedCount ? "Product updated." : "Product not found.");
});

// ---------- PATCH (partial update) ----------
routes.patch("/products/:id", async (req, res) => {
  const db = req.db;
  const updates = req.body;

  if ("price" in updates) updates.price = parseFloat(updates.price);
  if ("quantity" in updates) updates.quantity = parseInt(updates.quantity);

  const result = await db.collection("products").updateOne(
    { id: parseFloat(req.params.id) },
    { $set: updates }
  );

  res.send(result.modifiedCount ? "Product patched." : "Product not found.");
});

// ---------- DELETE ----------
routes.delete("/products/:id", async (req, res) => {
  const db = req.db;
  const id = parseFloat(req.params.id);

  const product = await db.collection("products").findOne({ id });
  if (!product) return res.status(404).send("Product not found.");

  // Delete image file if it exists
  if (product.image) {
    const imagePath = path.join(__dirname, "../", product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await db.collection("products").deleteOne({ id });
  res.send("Product deleted.");
});



// routes.post("/products", async (req, res) => {
//   console.log("POST /products called with:", req.body); // ✅ Add this line

//   const { id, title, price, category, description, image, quantity } = req.body;
//   const db = req.db;

//   await db.collection("products").insertOne({
//     id,
//     title,
//     price,
//     category,
//     description,
//     image,
//     quantity
//   });

//   res.send("Products Uploaded .. one !");
// });



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


