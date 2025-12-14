const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('User Service OK'));

app.use('/users', userRoutes);

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://mayfive123456_db_user:w68rT8OJdtHaVy8H@cluster0.ppfzcje.mongodb.net/user_db?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log("User DB connected on Atlas");
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`User Service running on port ${port}`));
  })
  .catch(err => {
    console.log("DB connection error:", err.message);
    process.exit(1);
  });
