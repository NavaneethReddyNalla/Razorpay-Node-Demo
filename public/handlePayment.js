async function payNow() {
  const amount = document.getElementById("amount").value;

  // Create order by calling the server endpoint
  const response = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
    }),
  });

  const order = await response.json();
  console.log(order);

  const options = {
    key: "***********", // First test key id
    amount: order.amount,
    currency: "INR",
    name: "ICMACC2026",
    description: "Test Transaction",
    order_id: order.id,
    callback_url: "/api/payment/verify-payment",
    theme: {
      color: "#1362f7",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
