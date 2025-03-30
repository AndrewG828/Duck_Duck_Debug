const express = require("express");
const userRoutes = require("./user");
const mistralRoutes = require("./mistral");
const openAIRoutes = require("./openai");
const codeRoutes = require("./code");
const ragRoutes = require("./rag");


const router = express.Router()

router.use("/user", userRoutes);
router.use("/mistral", mistralRoutes);
router.use("/openai", openAIRoutes);
router.use("/code", codeRoutes);
router.use("/rag", ragRoutes);

module.exports = router;