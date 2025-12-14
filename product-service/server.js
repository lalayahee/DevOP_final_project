const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Product Service OK'));

app.use('/products', productRoutes);

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://mayfive123456_db_user:w68rT8OJdtHaVy8H@cluster0.ppfzcje.mongodb.net/product_db?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log("Product DB connected on Atlas");
    const port = process.env.PORT || 3002;
    app.listen(port, () => console.log(`Product Service running on port ${port}`));
  })
  .catch(err => {
    console.log("DB connection error:", err.message);
    process.exit(1);
  });
