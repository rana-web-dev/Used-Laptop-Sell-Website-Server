const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a8e9r20.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// prettier-ignore
const usedProductsBrand = client.db("usedProductsSell").collection("brands");
const Hp = client.db("usedProductsSell").collection("productsDetails");
const dell = client.db("usedProductsSell").collection("dell");
const acer = client.db("usedProductsSell").collection("acer");
const userInfo = client.db("usedProductsSell").collection("userInfo");
const products = client.db("usedProductsSell").collection("products");
// prettier-ignore
const bookedProducts = client.db("usedProductsSell").collection("productsBooked");
const paymentInfo = client.db("usedProductsSell").collection("paymentInfo");

// Save paymentInfo to database
app.post("/payment", async(req, res) => {
  const paymentData = req.body;
  const result = await paymentInfo.insertOne(paymentData);
  res.send(result);
})

// get book products data from database to delete
app.delete("/deleteOrder/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await bookedProducts.deleteOne(query);
  res.send(result);
});

// get products data from database to delete
app.delete("/deleteProducts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await products.deleteOne(query);
  res.send(result);
});

// get all products from database
app.get("/allProducts", async (req, res) => {
  const query = {};
  const result = await products.find(query).toArray();
  res.send(result);
});

// Save book now data to database
app.post("/bookNow", async (req, res) => {
  const bookData = req.body;
  console.log(bookData);
  const booked = await bookedProducts.insertOne(bookData);
  res.send(booked);
});

// Get book now data from database
app.get("/bookNow", async (req, res) => {
  const result = await bookedProducts.find({}).toArray();
  res.send(result);
});

// add product
app.post("/addProduct", async (req, res) => {
  const product = req.body;
  const data = await products.insertOne(product);
  res.send(data);
});

// user save on database
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const result = await userInfo.insertOne(user);
    res.send(result);
  } catch {}
});

// get all users from database
app.get("/users", async (req, res) => {
  const query = {};
  const users = await userInfo.find(query).toArray();
  res.send(users);
});

// get one user to delete
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await userInfo.deleteOne(query);
  res.send(result);
});

// get admin from database
app.get("/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await userInfo.findOne(query);
  res.send({ isAdmin: user?.userType === "admin" });
});

// get buyer from database
app.get("/users/buyer/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await userInfo.findOne(query);
  res.send({ isBuyer: user?.userType === "buyer" });
});

// get seller from database
app.get("/users/seller/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await userInfo.findOne(query);
  res.send({ isSeller: user?.userType === "seller" });
});

app.get("/brands", async (req, res) => {
  try {
    const brandsProducts = await usedProductsBrand.find({}).toArray();
    res.send(brandsProducts);
  } catch {}
});

// hp data load
app.get("/Hp/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { brandId: ObjectId(id) };
    const result = await Hp.find(query).toArray();
    res.send(result);
  } catch {}
});

// dell data load
app.get("/Dell/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { brandId: ObjectId(id) };
    const result = await dell.find(query).toArray();
    res.send(result);
  } catch {}
});

// acer data load
app.get("/Acer/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { brandId: ObjectId(id) };
    const result = await acer.find(query).toArray();
    res.send(result);
  } catch {}
});

app.get("/", (req, res) => {
  res.send("Resale Web Server is Running...");
});

app.listen(port, () => {
  console.log(`Resale Web Server Running on: ${port}`);
});
