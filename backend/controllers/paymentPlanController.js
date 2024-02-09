// controllers/paymentPlanController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getPaymentPlans = async (req, res) => {
  try {
    const paymentPlans = await prisma.paymentPlan.findMany();
    res.status(200).json(paymentPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addPaymentPlan = async (req, res) => {
  try {
    const paymentPlan = await prisma.paymentPlan.create({
      data: req.body,
    });
    res.status(201).json(paymentPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePaymentPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const paymentPlan = await prisma.paymentPlan.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.status(200).json(paymentPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePaymentPlan = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.paymentPlan.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
