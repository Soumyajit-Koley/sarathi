const { twiml } = require('../utils/twilio');
const { generateVoiceReply } = require('../utils/setup');
const { LANGUAGES } = require('../utils/setup');
const { appendFollowUpGather } = require('../utils/twilio');
const { createVoiceResponse } = require('../utils/twilio');
// const { cleanString } = require('../utils/sanitize');
// const { getPublicBaseUrl } = require('../utils/sanitize');

const processLanguage = (req, res) => {
    const baseUrl = getPublicBaseUrl(req);
    const digit = req.body?.Digits || req.query?.Digits || '1';
    const selectedLang = LANGUAGES[digit] || LANGUAGES['1'];

    console.log(`Language selected: Digit ${digit} -> ${selectedLang.name} (${selectedLang.code})`);

    const response = new twiml.VoiceResponse();

    const gather = response.gather({
        input: 'speech',
        language: selectedLang.code,
        speechTimeout: 'auto',
        action: `${baseUrl}/ask_gemini?lang_digit=${encodeURIComponent(digit)}`,
        method: 'POST'
    });

    gather.say({ language: selectedLang.code, voice: selectedLang.voice }, selectedLang.prompt);

    response.redirect(
        { method: 'POST' },
        `${baseUrl}/process_language?Digits=${encodeURIComponent(digit)}`
    );

    res.type('text/xml');
    res.send(response.toString());
}

const askGemini = async (req, res) => {
    const baseUrl = getPublicBaseUrl(req);
    const userSpeech = req.body?.SpeechResult || req.query?.SpeechResult;
    const langDigit = req.query?.lang_digit || '1';
    const selectedLang = LANGUAGES[langDigit] || LANGUAGES['1'];

    const response = new twiml.VoiceResponse();

    if (userSpeech) {
        console.log(`User asked (${selectedLang.name}): "${userSpeech}"`);

        const prompt =
            `You are a helpful voice assistant on a phone call in India. ` +
            `Keep your answer under 3 short sentences, conversational, and easy to hear. ` +
            `Do NOT use markdown, bullet points, or asterisks. ` +
            `You MUST answer entirely in ${selectedLang.name} using native ${selectedLang.name} script. ` +
            `The user is asking: ${userSpeech}`;

        try {
            const rawAnswer = await generateVoiceReply(prompt);
            const answerText = rawAnswer.replace(/[*#_~`>]/g, '').trim();

            console.log(`Gemini replied (${selectedLang.name}): "${answerText}"`);

            response.say(
                { language: selectedLang.code, voice: selectedLang.voice },
                answerText
            );
        } catch (error) {
            console.error('Gemini API Error:', error);
            response.say(
                { language: 'en-IN', voice: 'Polly.Aditi' },
                'Sorry, I am having trouble thinking right now. Please try again.'
            );
        }
    } else {
        console.log('No speech detected from user.');
    }

    const gather = response.gather({
        input: 'speech',
        language: selectedLang.code,
        speechTimeout: 'auto',
        action: `${baseUrl}/ask_gemini?lang_digit=${encodeURIComponent(langDigit)}`,
        method: 'POST'
    });

    gather.say(
        { language: selectedLang.code, voice: selectedLang.voice },
        selectedLang.followUpPrompt
    );

    response.redirect(
        { method: 'POST' },
        `${baseUrl}/process_language?Digits=${encodeURIComponent(langDigit)}`
    );

    res.type('text/xml');
    res.send(response.toString());
}

module.exports = {
    processLanguage,
    askGemini
};