const stripe = require("../config/stripeConfig");
const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

exports.createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      //line_items: req.body.line_items, // Assume body contains line_items
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "price_1OgBfvErhU2BBi1r6kImrv3D",
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      // success_url: `${YOUR_DOMAIN}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getSessionStatus = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    res.send({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.config = (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};
