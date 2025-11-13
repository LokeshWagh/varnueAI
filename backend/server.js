const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes"); 
const authMiddleware = require('./middleware/authmiddleware.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "*"
}));
app.use(express.json()); 


app.get("/", (req, res) => {
  res.send("Supabase Auth API is running 🚀");
});

app.use("/api", authRoutes); 


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
