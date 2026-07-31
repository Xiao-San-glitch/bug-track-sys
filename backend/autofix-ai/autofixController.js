const { GoogleGenerativeAI } = require('@google/generative-ai');

const autofix = async (req, res) => {
    const { bugTitle, bugDescription, code } = req.body;

    if (!bugTitle && !code) {
        return res.status(400).json({ message: 'Please provide bug details or code to fix.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ message: 'Gemini API key not configured. Add GEMINI_API_KEY to your .env file.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert software debugger. A bug has been reported with the following details:

Bug Title: ${bugTitle || 'N/A'}
Bug Description: ${bugDescription || 'N/A'}
Buggy Code:
\`\`\`
${code || 'No code provided'}
\`\`\`

Please:
1. Briefly explain what the bug is (1-2 sentences).
2. Provide the fixed code.
3. Briefly explain what you changed and why (bullet points).

Format your response clearly with sections: "Bug Analysis", "Fixed Code", and "Changes Made".`;

        const result = await model.generateContent(prompt);
        const fix = result.response.text();

        res.json({ success: true, fix });
    } catch (error) {
        console.error('Gemini API error:', error.message);
        res.status(500).json({ message: 'AI service error: ' + error.message });
    }
};

module.exports = { autofix };
