// controllers/courseController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const course = await prisma.course.create({
      data: req.body,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
