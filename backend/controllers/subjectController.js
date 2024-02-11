// controllers/subjectController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addSubject = async (req, res) => {
  try {
    const subject = await prisma.subject.create({
      data: req.body,
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await prisma.subject.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.status(200).json(subject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
