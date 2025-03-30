const express = require('express');
const config = require('../config/config');
const axios = require('axios');

const OPENAI_API_KEY = config.openaiApiKey

const router = express.Router()

async function ragQueryResponse(query) {
    try {
        const retrievedDocs = await queryKnowledgeBase(query); 

        const prompt = `Given the following documents:\n\n${retrievedDocs.join('\n')}\n\nAnswer this question: ${query}`;
        
        const response = await axios.post(
            'https://api.openai.com/v1/completions', 
        {
            model: "gpt-4", 
            messages: [{ role: "user", content: message }],
            temperature: 0.7,
            max_tokens: 150,
        }, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`
            }
        });

        return response.data.choices[0].text.trim();
        //return response.data.choices[0].message.content; //Use one of these
    } catch (error) {
        console.error("Error fetching response:", error.message);
    }
}

router.post('/rag-query', async (req, res) => {
    try {
      const { question } = req.body;
      const response = await axios.post('http://localhost:5001/query', { question });
    
      res.set('Content-Type', 'text/plain');
      res.send(response.data.answer);
    } catch (error) {
      console.error('Error in RAG route:', error.message);
      res.status(500).send('Failed to get RAG response');
    }
  });

  module.exports = router;