// routes/paymentPlanRoutes.js
const express = require("express");
const router = express.Router();
const paymentPlanController = require("../controllers/paymentPlanController");

router.get("/", paymentPlanController.getPaymentPlans);
router.post("/", paymentPlanController.addPaymentPlan);
router.put("/:id", paymentPlanController.updatePaymentPlan);
router.delete("/:id", paymentPlanController.deletePaymentPlan);

module.exports = router;
