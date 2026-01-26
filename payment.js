const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");

let currentOrderId = null;

const razorpay = new Razorpay({
  key_id: process.env.RZRP_KEY_ID,
  key_secret: process.env.RZRP_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_rcptid_${Math.floor(Math.random() * 1000 + 1)}`,
  };

  const order = await razorpay.orders.create(options);
  res.send(order);

  currentOrderId = order.id;
});

router.post("/verify-payment", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  // Check how to properly validate payment using signature
  if (
    !validatePaymentVerification(
      { order_id: currentOrderId, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RZRP_KEY_SECRET,
    )
  ) {
    return res.status(400).send("Payment verification failed");
  }

  // Firebase and Firestore logic to store everything
  // Mailing (But make sure it is not using await)
  // Or, for mail, you can store the mail details in Firestore, and externally mail it (Function Trigger)

  res.sendFile("./public/success.html", { root: __dirname });
  // res.redirect("https://icmacc.org/register/payment-success/?name=username")
});

module.exports = router;
