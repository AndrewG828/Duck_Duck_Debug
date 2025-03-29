const axios = require('axios');
const config = require('../config/config');
const express = require('express');

const OPENAI_API_KEY = config.openaiApiKey

const router = express.Router()

async function queryOpenAI(message) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4", 
                messages: [{ role: "user", content: message }],
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch response from OpenAI API");
    }
}

// Define the route to handle OpenAI queries
router.post("/test", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const openAIResponse = await queryOpenAI(message);
        res.json({ response: openAIResponse });
    } catch (error) {
        res.status(500).json({ error: "OpenAI API Error" });
    }
});

module.exports = router;