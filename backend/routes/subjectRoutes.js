// routes/subjectRoutes.js
const express = require("express");
const subjectController = require("../controllers/subjectController");
const router = express.Router();

router.get("/", subjectController.getSubjects);
router.post("/", subjectController.addSubject);
router.put("/:id", subjectController.updateSubject);
router.delete("/:id", subjectController.deleteSubject);

module.exports = router;
