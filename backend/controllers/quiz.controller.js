// const { OpenAI } = require("openai");
// const dotenv = require("dotenv");
// dotenv.config();

// const db = require("../models");
// const Quiz = db.QuizAttempt// ensure this path is correct
// //const {  json } = require("body-parser");
// const Course = db.Course;
// const Keywords = db.Keywords;

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const getAllQuizzes = async (req, res) => {
//   const quizzes = await Quiz.findAll();
//   res.json(quizzes);
// };

// const getQuizById = async (req, res) => {
//   const quiz = await Quiz.findByPk(req.params.id);
//   if (!quiz) return res.status(404).json({ error: "Quiz not found" });
//   res.json(quiz);
// };

// const createQuiz = async (req, res) => {
//   const quiz = await Quiz.create(req.body);
//   res.status(201).json(quiz);
// };

// const updateQuiz = async (req, res) => {
//   await Quiz.update(req.body, { where: { id: req.params.id } });
//   res.json({ message: "Quiz updated" });
// };

// const deleteQuiz = async (req, res) => {
//   await Quiz.destroy({ where: { id: req.params.id } });
//   res.json({ message: "Quiz deleted" });
// };
// const submitQuizScore = async (req, res) => {
//   const { user_id, course_id, score } = req.body;

//   if (!user_id || !course_id || typeof score !== "number") {
//     return res.status(400).json({ error: "user_id, course_id, and numeric score are required" });
//   }

//   const today = new Date().toISOString().split("T")[0];

//   try {
//     const attempt = await Quiz.findOne({
//       where: {
//         user_id,
//         course_id,
//         date: today,
//       },
//     });

//     if (!attempt) {
//       return res.status(404).json({ error: "No quiz attempt found for today." });
//     }

//     const percentage = (score / 5) * 100;
//     const passed = percentage >= 65;

//     await attempt.update({ score, passed });

//     res.json({
//       message: "Score submitted",
//       score,
//       percentage: Math.round(percentage * 100) / 100, // rounded to 2 decimal places
//       passed,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// const generateQuiz = async (req, res) => {
//   const { user_id, courseId, keywordIds } = req.body;

//   if (!user_id || !courseId || !Array.isArray(keywordIds)) {
//     return res.status(400).json({ error: "user_id, courseId and keywordIds are required" });
//   }

//   try {
//     const today = new Date().toISOString().split("T")[0];

//     const existing = await Quiz.findOne({
//       where: {
//         user_id,
//         course_id: courseId,
//         date: today
//       }
//     });

//     if (existing) {
//       return res.status(403).json({ error: "You have already attemepted a quiz today for this course." });
//     }

//     const course = await Course.findByPk(courseId);
//     if (!course) return res.status(404).json({ error: "Course not found" });

//     const keywords = await Keywords.findAll({ where: { id: keywordIds } });
//     const topics = keywords.map(k => k.keyword);

//     if (topics.length === 0) {
//       return res.status(400).json({ error: "No valid topics found" });
//     }

//     const prompt = `
// You are an expert MCQ quiz generator.

// Given the course name and its list of topics, generate a short test quiz of exactly 5 multiple choice questions in this structure:

// {
//   "questions": {
//     "easy": [...1 question...],
//     "medium": [...1 question...],
//     "hard": [...1 question...],
//     "realWorld": [...2 scenario-based questions...]
//   }
// }

// Each question object must include:
// - "question": the multiple choice question
// - "options": an array of 4 answer choices
// - "answer": the correct answer

// Only use the provided topics:
// Course: ${course.course_name}
// Topics: ${topics.join(", ")}

// Respond with raw JSON only. Do not include any explanations or extra text.
// `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4.1-nano",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3,
//     });

//     const raw = response.choices[0].message.content;
//     let cleaned=raw.trim();
//     try {
//       //const parsed = JSON.parse(raw);
//       const json = JSON.parse(cleaned);
//       const savedQuiz = await Quiz.create({
//         user_id,
//         course_id: courseId,
//         quiz_data: json,
//         date: today,
//         score: null,
//         passed: null
//       });
//       console.log("✅ Quiz saved with ID:", savedQuiz.id);


//     //   return res.status(200).json({ quiz: json, saved: true });

//     // } catch {
//     //   return res.status(500).json({ error: "Invalid GPT JSON", raw });
//     // }
//       return res.status(200).json({ quiz: json, saved: true });
// } catch (err) {
//   console.error("GPT JSON PARSE FAILED", err.message);
//   return res.status(500).json({ error: "Invalid GPT JSON", raw });
// }

//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   getAllQuizzes,
//   getQuizById,
//   createQuiz,
//   updateQuiz,
//   deleteQuiz,
//   generateQuiz,
//   submitQuizScore,
// };
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const db = require("../models");
const Quiz = db.QuizAttempt;
const Course = db.Course;
const Keywords = db.Keywords;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getAllQuizzes = async (req, res) => {
  const quizzes = await Quiz.findAll();
  res.json(quizzes);
};

const getQuizById = async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  res.json(quiz);
};

const createQuiz = async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json(quiz);
};

const updateQuiz = async (req, res) => {
  await Quiz.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Quiz updated" });
};

const deleteQuiz = async (req, res) => {
  await Quiz.destroy({ where: { id: req.params.id } });
  res.json({ message: "Quiz deleted" });
};

// 🔴 Quiz Status Route
// const getQuizStatus = async (req, res) => {
//   const user_id = req.session.userId;
//   const course_id = req.query.courseId;

//   if (!user_id || !course_id) return res.status(400).json({ error: "Missing user session or courseId" });

//   const today = new Date().toISOString().split("T")[0];

//   const quiz = await Quiz.findOne({
//     where: {
//       user_id,
//       course_id,
//       date: today,
//     },
//   });

//   if (!quiz) return res.json({ attempted: false });

//   res.json({
//     attempted: true,
//     passed: quiz.passed,
//     score: quiz.score,
//     createdAt: quiz.createdAt,
//   });
// };
const getQuizStatus = async (req, res) => {
  try {
   // console.log("🔍 Session object:", req.session);
    const user_id = req.session.userId;
    const course_id_raw = req.query.courseId;

    console.log("📦 Raw course ID from query:", course_id_raw);
    const course_id = parseInt(course_id_raw);
    if (!user_id || isNaN(course_id)) {
      //console.log("❌ Missing user session or invalid courseId");
      return res.status(400).json({ error: "Missing user session or courseId" });
    }

    const today = new Date().toISOString().split("T")[0];
    //console.log(`📅 Looking for quiz attempt on ${today} for user ${user_id} and course ${course_id}`);

    const quiz = await Quiz.findOne({
      where: {
        user_id,
        course_id,
        date: today,
      },
    });

  
  if (!quiz) {
 // console.log("📭 No quiz attempt found for today");
  return res.json({ attempted: false });
}

 // ✅ Only treat as attempted if submitted
    if (quiz.score === null || quiz.passed === null) {
      return res.json({ attempted: false });
    }

console.log("✅ Quiz attempt submitted:", quiz.id);
return res.json({
  attempted: true,
  passed: quiz.passed,
  score: quiz.score,
  createdAt: quiz.createdAt,
});

  } catch (err) {
    console.error("❌ Internal error in getQuizStatus:", err.message);
    return res.status(500).json({ error: "Internal error", details: err.message });
  }
};


// ✅ Submit Score (Updated scoring logic)
// const submitQuizScore = async (req, res) => {
//   const user_id = req.session.userId;
//   const { course_id, responses } = req.body;

//   if (!user_id || !course_id || !responses) {
//     return res.status(400).json({ error: "Missing data" });
//   }

//   const today = new Date().toISOString().split("T")[0];

//   try {
//     const attempt = await Quiz.findOne({
//       where: {
//         user_id,
//         course_id,
//         date: today,
//       },
//     });

//     if (!attempt) return res.status(404).json({ error: "No quiz found for today." });

//     const quizData = attempt.quiz_data;
//     const questions = quizData?.questions;

//     if (!questions) return res.status(400).json({ error: "Quiz data is missing" });

//     let score = 0;

//     // Scoring logic
//     const scoring = {
//       easy: 1,
//       medium: 2,
//       hard: 2,
//       realWorld: 2,
//     };

//     for (const level of ["easy", "medium", "hard", "realWorld"]) {
//       const qList = questions[level] || [];
//       qList.forEach((q, index) => {
//         const userAnswer = responses[level]?.[index];
//         if (userAnswer && userAnswer === q.answer) {
//           score += scoring[level];
//         }
//       });
//     }

//     const percentage = (score / 50) * 100;
//     const passed = percentage >= 65;

//     await attempt.update({ score, passed });

//     res.json({
//       message: "Score submitted",
//       score,
//       percentage: Math.round(percentage * 100) / 100,
//       passed,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const submitQuizScore = async (req, res) => {
  const user_id = req.session.userId;
  const { course_id, responses } = req.body;

  if (!user_id || !course_id || !responses) {
    return res.status(400).json({ error: "Missing data" });
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const attempt = await Quiz.findOne({
      where: {
        user_id,
        course_id,
        date: today,
      },
    });

    if (!attempt) return res.status(404).json({ error: "No quiz found for today." });

    const quizData = attempt.quiz_data;
    const questions = quizData?.questions;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Quiz data is missing or invalid format" });
    }

    let score = 0;

    // ✅ Flat question array, each correct = 2 marks
    questions.forEach((q, index) => {
      const userAnswer = responses[index];
      if (userAnswer && userAnswer === q.answer) {
        score += 2;
      }
    });

    const percentage = (score / 50) * 100;
    const passed = score >= 20;

    await attempt.update({ score, passed });

    res.json({
      message: "Score submitted",
      score,
      percentage: Math.round(percentage * 100) / 100,
      passed,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Generate Quiz (30 questions, session-based)
// const generateQuiz = async (req, res) => {
//   console.log("📥 Quiz generation triggered");
//   const user_id = req.session.userId;
//   const { courseId, keywordIds } = req.body;

//   if (!user_id || !courseId || !Array.isArray(keywordIds)) {
//     return res.status(400).json({ error: "Missing user session or invalid payload" });
//   }

//   try {
//     const today = new Date().toISOString().split("T")[0];

//     const existing = await Quiz.findOne({
//       where: {
//         user_id,
//         course_id: courseId,
//         date: today,
//       },
//     });

//     if (existing) {
//       return res.status(403).json({ error: "You already attempted this quiz today" });
//     }
//       // 2. Prevent duplicate creation within 5 seconds
//   const existingRecent = await Quiz.findOne({
//     where: {
//       user_id,
//       course_id: courseId,
//       createdAt: {
//         [db.Sequelize.Op.gte]: new Date(Date.now() - 5000), // last 5s
//       },
//     },
//   });

//   if (existingRecent) {
//     return res.status(429).json({ error: "Duplicate quiz creation detected. Please wait." });
//   }

//     const course = await Course.findByPk(courseId);
//     if (!course) return res.status(404).json({ error: "Course not found" });

//     const keywords = await Keywords.findAll({ where: { id: keywordIds } });
//     const topics = keywords.map(k => k.keyword);

//     if (!topics.length) return res.status(400).json({ error: "No topics found" });

//     const prompt = `
// You are a quiz generator.

// Create a JSON quiz of 30 multiple choice questions split as:
// - 10 "easy"
// - 8 "medium"
// - 7 "hard"
// - 5 "realWorld"

// Each question must have:
// - "question"
// - "options": array of 4 strings
// - "answer": correct string

// Format:
// {
//   "questions": {
//     "easy": [ ...10... ],
//     "medium": [ ...8... ],
//     "hard": [ ...7... ],
//     "realWorld": [ ...5... ]
//   }
// }

// Course: ${course.course_name}
// Topics: ${topics.join(", ")}
// Return raw JSON only.
// `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4.1-nano",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3,
//     });

//     const raw = response.choices[0].message.content.trim();
//     const quizJson = JSON.parse(raw);

//     const savedQuiz = await Quiz.create({
//       user_id,
//       course_id: courseId,
//       quiz_data: quizJson,
//       date: today,
//       score: null,
//       passed: null,
//     });

//     console.log("✅ Quiz saved:", savedQuiz.id);
//     res.status(200).json({ quiz: quizJson, saved: true });
//   } catch (err) {
//     console.error("GPT Error or DB:", err.message);
//     res.status(500).json({ error: "Quiz generation failed", details: err.message });
//   }
// };
// const generateQuiz = async (req, res) => {
//   console.log("📥 Quiz generation triggered");

//   const user_id = req.session.userId;
//   const { courseId, keywordIds } = req.body;

//   if (!user_id || !courseId || !Array.isArray(keywordIds)) {
//     return res.status(400).json({ error: "Missing user session or invalid payload" });
//   }

//   const t = await db.sequelize.transaction(); // Begin transaction
//   try {
//     const today = new Date().toISOString().split("T")[0];

//     // Check if a quiz already exists for today within the transaction
//     const existing = await Quiz.findOne({
//       where: {
//         user_id,
//         course_id: courseId,
//         date: today,
//       },
//       transaction: t,
//       lock: t.LOCK.UPDATE,
//     });

//     if (existing) {
//       await t.rollback();
//       return res.status(403).json({ error: "You already attempted this quiz today" });
//     }

//     const course = await Course.findByPk(courseId);
//     if (!course) {
//       await t.rollback();
//       return res.status(404).json({ error: "Course not found" });
//     }

//     const keywords = await Keywords.findAll({ where: { id: keywordIds } });
//     const topics = keywords.map(k => k.keyword);

//     if (!topics.length) {
//       await t.rollback();
//       return res.status(400).json({ error: "No topics found" });
//     }

//     const prompt = `
// You are a quiz generator.

// Create a JSON quiz of 30 multiple choice questions split as:
// - 1 "easy"
// - 1 "medium"
// - 1 "hard"
// - 1 "realWorld"

// Each question must have:
// - "question"
// - "options": array of 4 strings
// - "answer": correct string

// Format:
// {
//   "questions": {
//     "easy": [ ...1... ],
//     "medium": [ ...1... ],
//     "hard": [ ...1... ],
//     "realWorld": [ ...1... ]
//   }
// }

// Course: ${course.course_name}
// Topics: ${topics.join(", ")}
// Return raw JSON only.
// `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4.1-nano",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3,
//     });

//     const raw = response.choices[0].message.content.trim();
//     const quizJson = JSON.parse(raw);

//     const savedQuiz = await Quiz.create({
//       user_id,
//       course_id: courseId,
//       quiz_data: quizJson,
//       date: today,
//       score: null,
//       passed: null,
//     }, { transaction: t });

//     await t.commit(); // ✅ Commit transaction
//     console.log("✅ Quiz saved:", savedQuiz.id);
//     res.status(200).json({ quiz: quizJson, saved: true });
//   } catch (err) {
//     await t.rollback(); // ❌ Rollback transaction on error
//     console.error("🚨 Quiz generation failed:", err.message);
//     res.status(500).json({ error: "Quiz generation failed", details: err.message });
//   }
// };
const generateQuiz = async (req, res) => {
  console.log("📥 Quiz generation triggered");

  const user_id = req.session.userId;
  const { courseId, keywordIds } = req.body;

  if (!user_id || !courseId || !Array.isArray(keywordIds)) {
    return res.status(400).json({ error: "Missing user session or invalid payload" });
  }

  const t = await db.sequelize.transaction(); // Begin transaction
  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if a quiz already exists for today within the transaction
    const existing = await Quiz.findOne({
      where: {
        user_id,
        course_id: courseId,
        date: today,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existing) {
      // ✅ If already submitted, block
      if (existing.score !== null && existing.passed !== null) {
        await t.rollback();
        return res.status(403).json({ error: "You already attempted this quiz today" });
      }

      // ✅ If generated but not submitted, return existing quiz
      await t.commit();
      console.log("♻️ Returning existing unsubmitted quiz:", existing.id);
      return res.status(200).json({ quiz: existing.quiz_data, saved: true });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      await t.rollback();
      return res.status(404).json({ error: "Course not found" });
    }

    const keywords = await Keywords.findAll({ where: { id: keywordIds } });
    const topics = keywords.map(k => k.keyword);

    if (!topics.length) {
      await t.rollback();
      return res.status(400).json({ error: "No topics found" });
    }

//     const prompt = `
// You are a quiz generator.

// Create a JSON quiz of 30 multiple choice questions split as:
// - 1 "easy"
// - 1 "medium"
// - 1 "hard"
// - 1 "realWorld"

// Each question must have:
// - "question"
// - "options": array of 4 strings
// - "answer": correct string

// Format:
// {
//   "questions": {
//     "easy": [ ...1... ],
//     "medium": [ ...1... ],
//     "hard": [ ...1... ],
//     "realWorld": [ ...1... ]
//   }
// }

// Course: ${course.course_name}
// Topics: ${topics.join(", ")}
// Return raw JSON only.
//     `;
// const prompt = `
// You are a quiz generator.

// Generate a JSON quiz with 25 **unique**, multiple-choice questions.

// Each question must have:
// - "question": a clear, concise MCQ question strictly based on the course and keywords
// - "options": an array of 4 meaningful answer choices
// - "answer": the correct answer string that exactly matches one of the options

// Format:
// {
//   "questions": [ 
//     {
//       "question": "...",
//       "options": ["...", "...", "...", "..."],
//       "answer": "..."
//     },
//     ...
//     // total 25 questions
//   ]
// }

// Rules:
// - All questions must be strictly based on the following:
//   - Course: ${course.course_name}
//   - Keywords/Topics: ${topics.join(", ")}
// - Ensure all questions are unique and varied in style.
// - No duplicate or repeated questions.
// - Avoid vague, generic, or unrelated content.

// Only return raw JSON. Do not include explanations or extra text.
// `;
// const prompt = `
// You are a quiz generator.

// Generate exactly 25 **unique**, multiple-choice questions in JSON format only.

// Each question must have:
// - "question": a clear, concise MCQ question strictly based on the course and keywords
// - "options": an array of 4 distinct, meaningful answer choices
// - "answer": one correct answer string from the options

// Format:
// {
//   "questions": [ 
//     {
//       "question": "...",
//       "options": ["...", "...", "...", "..."],
//       "answer": "..."
//     },
//     ...
//     // total 25 questions exactly
//   ]
// }

// Rules:
// - All questions must strictly relate to:
//   - Course: ${course.course_name}
//   - Keywords: ${topics.join(", ")}
// - Ensure questions are **unique**, well-structured, and grammatically correct.
// - Avoid vague or generic content.
// - No explanations or extra text — only return pure JSON.
// `;
// const prompt = `
// You are a quiz generator.

// Generate exactly 20 **unique**, multiple-choice questions in **pure JSON** format.

// Each question must include:
// - "question": a clear, concise MCQ related to the course and keywords
// - "options": an array of 4 distinct, meaningful answer choices
// - "answer": one correct option string (must match exactly one of the options)

// Output Format:
// {
//   "questions": [ 
//     {
//       "question": "...",
//       "options": ["...", "...", "...", "..."],
//       "answer": "..."
//     },
//     ...
//     // total 20 questions exactly
//   ]
// }

// Instructions:
// - All questions must be strictly based on:
//   - Course: ${course.course_name}
//   - Keywords: ${topics.join(", ")}
// - Ensure:
//   - All questions are unique and not repeated
//   - No generic, vague, or off-topic questions
//   - No explanations or extra commentary
//   - Only return valid JSON — no extra text
// `;
// const prompt = `
// You are a quiz generator.

// Generate exactly 20 unique, multiple-choice questions in valid JSON format.

// Each question must contain:
// - "question": a clear, concise MCQ related to the course and topics
// - "options": an array of 4 meaningful and distinct answer choices
// - "answer": the correct answer, exactly matching one of the options

// Strict instructions:
// - Generate exactly 20 questions — no more, no less
// - No repeated or duplicate questions
// - All questions must be strictly based on:
//    - Course: ${course.course_name}
//    - Topics: ${topics.join(", ")}
// - Avoid vague or generic questions
// - Output only raw JSON in this structure:

// {
//   "questions": [
//     {
//       "question": "...",
//       "options": ["...", "...", "...", "..."],
//       "answer": "..."
//     },
//     ...
//   ]
// }

// Return only JSON. No text or commentary.
// `;
// const prompt = `
// You are a quiz generator.

// Generate a JSON quiz with exactly 20 **unique**, multiple-choice questions.

// Each question must include:
// - "question": a clear, concise MCQ question based on the course and keywords
// - "options": an array of 4 **meaningful and non-overlapping** choices
// - "answer": one correct option from the "options" array

// Response format:
// {
//   "questions": [
//     {
//       "question": "...",
//       "options": ["...", "...", "...", "..."],
//       "answer": "..."
//     },
//     ...
//     // exactly 20 total questions
//   ]
// }

// ⚠️ RULES:
// - All questions must be strictly based on the following:
//   - Course: ${course.course_name}
//   - Keywords/Topics: ${topics.join(", ")}
// - Ensure all 20 questions are **unique**, clear, and relevant.
// - DO NOT return fewer than 20 questions.
// - DO NOT include any explanations or extra text.
// - If you cannot generate exactly 20, respond with an error JSON: { "error": "Unable to generate 20 questions." }
// `;
const prompt = `
You are a professional quiz generator.

Your task is to generate **exactly 21** unique, high-quality multiple-choice questions (MCQs) in valid JSON format.

Each question must contain:
- "question": a clear and specific question strictly related to the given course and keywords
- "options": an array of 4 distinct, meaningful choices (avoid overlap or trivial distractors). The **correct answer must be randomly positioned**, not always the first option.
- "answer": the correct answer string that matches one of the options exactly

⚠️ CRITICAL RULES:
- Generate **exactly 21** questions. Do **not return more or fewer**.
- All questions must be based strictly on:
  - Course Name: "${course.course_name}"
  - Keywords/Topics: ${topics.join(", ")}
- Questions must be 100% unique — no repeats or close variations.
- Keep the language concise, professional, and accurate.
- Do not include any explanation, reasoning, or text outside the JSON.
- The **correct answer MUST appear in a RANDOM position** among the 4 options.
- Do **not** place all correct answers in the first option.
- If you cannot generate exactly 21 valid questions, return this JSON: { "error": "Generation failed. Could not produce 21 unique questions." }

✅ FORMAT:
{
  "questions": [
    {
      "question": "Your question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option"
    },
    ...
    // 21 questions in total
  ]
}
`;





    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = response.choices[0].message.content.trim();
    console.log("🧪 Raw GPT response:", raw);

    const quizJson = JSON.parse(raw);
    const questions = quizJson.questions;
    
    console.log("🧠 Generated Questions Count:", questions.length);
    // Shuffle helper
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Shuffle options for each question
const shuffledQuestions = questions.map((q) => {
  const shuffledOptions = shuffleArray([...q.options]);
  return {
    question: q.question,
    options: shuffledOptions,
    answer: q.answer, // Still valid, string match logic will work
  };
});

const finalQuiz = { questions: shuffledQuestions };

  //console.log("✅ AI generated questions count:", questions.length);
    const savedQuiz = await Quiz.create({
      user_id,
      course_id: courseId,
      quiz_data: finalQuiz,
      date: today,
      score: null,
      passed: null,
    }, { transaction: t });

    await t.commit(); // ✅ Commit transaction
    console.log("✅ New quiz saved:", savedQuiz.id);
    return res.status(200).json({ quiz: finalQuiz, saved: true });
  } catch (err) {
    await t.rollback(); // ❌ Rollback on error
    console.error("🚨 Quiz generation failed:", err.message);
    return res.status(500).json({ error: "Quiz generation failed", details: err.message });
  }
};



module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  generateQuiz,
  submitQuizScore,
  getQuizStatus, // ✅ new
};
