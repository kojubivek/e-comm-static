import express from "express";
import stripe from "stripe";
import Order from "../models/Order.js";
const router = express.Router();

const stripeFun = stripe(process.env.STRIPE_KEY);

router.get("/payment", (req, res, next) => {
  res.json({
    status: "success",
    message: "payment",
  });
});

// router.post("/payment", async (req, res, next) => {
//   try {
//     const paymentIntent = await stripe.paymentIntent.create({
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "aud",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     res.json({
//       status: "success",
//       message: "payment Successfull",
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/payment", (req, res, next) => {
//   stripeFun.charges.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "aud",
//     },
//     {
//       apiKey: process.env.STRIPE_KEY,
//     },

//     (stripeErr, stripeRes) => {
//       if (stripeErr) {
//         next(stripeErr);
//       } else {
//         res.json({
//           status: "success",
//           message: "payment succesfull",
//           stripeRes,
//         });
//       }
//     }
//   );
// });

router.post("/payment", async (req, res, next) => {
  const amount = req.body.amount;
  const cart = req.body.products;
  const userId = req.body.userId;
  const tokenId = req.body.tokenId;
  const cardDetails = req.body.paymentDetails;

  // console.log(cardDetails, "userid");
  try {
    const lineItems = cart.map((product) => ({
      price: product.price,
      quantity: product.quantity,
      description: product.name,

      name: product.name,
    }));

    const paymentMethod = await stripeFun.paymentMethods.create({
      type: "card",
      card: {
        token: tokenId,
      },
    });
    console.log(paymentMethod, "paymetns");
    // const source = await stripeFun.sources.create({
    //   type: "card",
    //   token: tokenId,
    //   amount: amount,
    //   currency: "aud",
    // });
    const paymentIntent = await stripeFun.paymentIntents.create({
      amount: amount,
      currency: "aud",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      description: "Payment for Cart",
      metadata: {
        line_items: JSON.stringify(lineItems),
      },
    });
    console.log(paymentIntent, "payment intent");
    // Confirm the payment intent
    const confirmedPaymentIntent = await stripeFun.paymentIntents.confirm(
      paymentIntent.id
    );
    console.log(confirmedPaymentIntent, "confire");
    // Check if the payment intent confirmation is successful
    if (confirmedPaymentIntent.status !== "succeeded") {
      return res.status(400).json({
        status: "error",
        message: "Payment intent confirmation is not successful",
      });
    }

    // Create a new Order record in your database
    const newOrder = new Order({
      userId: userId,
      products: cart,
      amount: confirmedPaymentIntent.amount,
      address: cardDetails,
      status: "recieved",
    });
    await newOrder.save();

    res.json({
      status: "success",
      message: "Payment intent confirmed and order created",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
