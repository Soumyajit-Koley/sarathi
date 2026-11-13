const express = require('express');
const { rootMessage } = require('./controllers/root.controller.js');
const { callMe, voiceResponse } = require('./controllers/call.controller.js');
const { processLanguage, askGemini } = require('./controllers/ai.controller.js');
const { getPublicBaseUrl } = require('./utils/sanitize.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get('/', rootMessage);
app.get('/call-me', callMe);
app.all('/voice', voiceResponse);
app.all('/process_language', processLanguage);
app.all('/ask_gemini', askGemini);

module.exports = {
    app
};