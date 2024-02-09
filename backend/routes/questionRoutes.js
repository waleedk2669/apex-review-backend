// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/", questionController.getQuestions);
router.post("/", questionController.addQuestion);
router.post("/bulk", questionController.addQuestionsInBulk);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
