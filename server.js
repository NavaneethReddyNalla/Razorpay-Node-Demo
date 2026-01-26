const express = require("express");
process.loadEnvFile("./.env");
const paymentRounter = require("./payment");
const app = express();

app.use(express.json()); // This is needed for our api endpoint communication with our frontend
app.use(express.urlencoded({ extended: true })); // THIS IS A MUST FOR RAZORPAY TO WORK as it sends data in URLENCODED FORMAT
app.use(express.static("./public"));

app.use("/api/payment", paymentRounter);

app.get("/test-endpoint", (req, res) => {
  res.send("Alive");
});

app.listen(5000, () => console.log("Server Live")); // Not needed in Firebase functions
