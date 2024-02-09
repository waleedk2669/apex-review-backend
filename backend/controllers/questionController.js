// controllers/questionController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany();
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const question = await prisma.question.create({
      data: req.body,
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addQuestionsInBulk = async (req, res) => {
  const { questions } = req.body; // Expect an array of question objects
  try {
    const result = await prisma.$transaction(
      questions.map((question) =>
        prisma.question.create({
          data: question,
        })
      )
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await prisma.question.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.question.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
