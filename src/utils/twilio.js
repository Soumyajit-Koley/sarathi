const { twiml } = require('twilio');

function createVoiceResponse() {
    return new twiml.VoiceResponse();
}

function appendFollowUpGather(response, baseUrl, langDigit, selectedLang) {
    const gather = response.gather({
        input: 'speech',
        language: selectedLang.code,
        speechTimeout: '1',
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
}

module.exports = {
    createVoiceResponse,
    appendFollowUpGather,
    twiml
};