import express from "express";
import { Contest } from "../models/User.js";

const router = express.Router();

// Endpoint to fetch questions from completed contests only
router.get("/practice", async (req, res) => {
  try {
    // Find all contests that are completed and populate the questions field
    const contests = await Contest.find({ status: "completed" }).populate("questions");
    
    // Flatten all questions from each contest into one array
    let questions = [];
    contests.forEach(contest => {
      if (contest.questions && contest.questions.length > 0) {
        questions = questions.concat(contest.questions);
      }
    });

    // Remove duplicates if a question appears in multiple contests
    const uniqueQuestions = [];
    const seenIds = new Set();
    for (const question of questions) {
      if (!seenIds.has(question._id.toString())) {
        uniqueQuestions.push(question);
        seenIds.add(question._id.toString());
      }
    }

    res.json(uniqueQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
