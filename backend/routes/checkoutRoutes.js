const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  getSessionStatus,
  createPaymentIntent,
  config,
} = require("../controllers/checkoutController");

router.post("/create-checkout-session", createCheckoutSession);
router.post("/create-payment-intent", createPaymentIntent);
router.get("/session-status", getSessionStatus);
router.get("/config", config);

module.exports = router;
