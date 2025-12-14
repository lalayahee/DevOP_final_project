const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Order Service OK'));

app.use('/orders', orderRoutes);

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://mayfive123456_db_user:w68rT8OJdtHaVy8H@cluster0.ppfzcje.mongodb.net/order_db?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log("Order DB connected on Atlas");
    const port = process.env.PORT || 3003;
    app.listen(port, () => console.log(`Order Service running on port ${port}`));
  })
  .catch(err => {
    console.log("DB connection error:", err.message);
    process.exit(1);
  });
