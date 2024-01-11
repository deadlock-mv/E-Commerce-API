const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");


dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("DB connection Successful")})
.catch((err)=>{console.log(err)});

app.listen(3000, ()=> {
    console.log("Backend Server is running");
})

app.use(express.json());

app.get("/api/test", ()=>{
    console.log("Testing");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);


