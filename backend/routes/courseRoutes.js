// routes/courseRoutes.js
const express = require("express");
const courseController = require("../controllers/courseController");
const router = express.Router();

router.get("/", courseController.getCourses);
router.post("/", courseController.addCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
