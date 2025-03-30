const { queryMistral } = require("./huggingface");
const express = require("express");
const router = express.Router();

router.post("/unformatted", async (req, res) => {
    const { message } = req.body;

    if (!message) return res.status(400).json({error: "Message to Mistral is required"});

    try {
        const mistralResponse = await queryMistral(message);
        res.json({response: mistralResponse[0].generated_text});
    } catch (error) {
        res.status(500).json({error: "Mistral API error"})
    }
});

router.post("/formatted", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const mistralResponse = await queryMistral(message);

        const generatedText = mistralResponse[0].generated_text || 'No response generated';
        res.set('Content-Type', 'text/plain');
        // res.json({ response: generatedText });
        res.send(generatedText); 
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Mistral API Error" });
    }
});

module.exports = router;


