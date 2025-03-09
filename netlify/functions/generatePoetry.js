const fetch = require("node-fetch");

exports.handler = async (event) => {
    try {
        // Extract the mood from query parameters
        const mood = event.queryStringParameters.mood;

        if (!mood) {
            console.log("No mood provided.");
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Mood is required" })
            };
        }

        // Check if API key is available
        const API_KEY = process.env.OPENAI_API_KEY;

        if (!API_KEY) {
            console.log("API Key is missing.");
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "API Key missing" })
            };
        }

        // Call OpenAI's API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "You are a Punjabi poet like Shiv Kumar Batalvi." },
                    { role: "user", content: `Write a 4-line rhyming Punjabi poem (Gurmukhi) about the mood: ${mood}. Provide an English transliteration.` }
                ],
                max_tokens: 400
            })
        });

        const data = await response.json();
        console.log("OpenAI Response:", data); // Debugging log

        // Validate OpenAI response
        if (
            !data.choices ||
            data.choices.length === 0 ||
            !data.choices[0].message ||
            !data.choices[0].message.content
        ) {
            throw new Error("Invalid response from OpenAI.");
        }

        // Return the generated poem
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ poem: data.choices[0].message.content })
        };

    } catch (error) {
        console.error("Error:", error); // Debugging log for the error

        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message })
        };
    }
};
