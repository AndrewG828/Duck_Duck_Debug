const axios = require ("axios");
const config = require("../config/config")

const MISTRAL_API_KEY = config.mistralApiKey
const KIM_MISTRAL_API_KEY = config.kimMistralApiKey

async function queryMistral(prompt) {
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
            {
                inputs: prompt
            }, 
            {
                headers: { Authorization: `Bearer ${KIM_MISTRAL_API_KEY}` },
            }
        );
        return response.data;
    }
    catch (error) {
        console.error("Hugging Face API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch response from Hugging Face API");
    }
}


module.exports = { queryMistral };