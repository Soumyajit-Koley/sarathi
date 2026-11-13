require('dotenv').config();  
const twilio = require('twilio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { cleanString, getPublicBaseUrl } = require('./sanitize');

const twiml = twilio.twiml;

const accountSid = cleanString(process.env.TWILIO_ACCOUNT_SID);
const authToken = cleanString(process.env.TWILIO_AUTH_TOKEN);
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

const genAI = new GoogleGenerativeAI(cleanString(process.env.GEMINI_API_KEY));
const CANDIDATE_MODELS = [
    process.env.GEMINI_MODEL,
    'gemini-3.6-flash',
    'gemini-3-flash-preview',
    'gemini-flash-latest'
].filter(Boolean);

let activeModelName = CANDIDATE_MODELS[0];

async function generateVoiceReply(prompt) {
    const modelsToTry = [
        activeModelName,
        ...CANDIDATE_MODELS.filter((m) => m !== activeModelName)
    ];

    let lastError = null;
    for (const modelName of modelsToTry) {
        try {
            const currentModel = genAI.getGenerativeModel({ model: modelName });
            const result = await currentModel.generateContent(prompt);
            const text = result.response.text();
            if (activeModelName !== modelName) {
                console.log(`✅ Switched active Gemini model to: ${modelName}`);
                activeModelName = modelName;
            }
            return text;
        } catch (err) {
            console.warn(`⚠️ Model ${modelName} failed (${err.status || err.message}), trying next...`);
            lastError = err;
        }
    }
    throw lastError;
}



function getActiveModelName() {
    return activeModelName;
}

module.exports = {
    twilioClient,
    twiml,
    generateVoiceReply,
    getActiveModelName,
    getPublicBaseUrl
};
