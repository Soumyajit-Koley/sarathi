function cleanString(str = '') {
    return String(str)
        .replace(/[\s\u00A0\u200B-\u200D\uFEFF]+/g, '')
        .replace(/\/+$/, '');
}

function getPublicBaseUrl(req) {
    if (process.env.PUBLIC_URL) {
        const envUrl = cleanString(process.env.PUBLIC_URL);
        if (envUrl !== '') return envUrl;
    }
    const rawHost = req?.headers?.['x-forwarded-host'] || req?.get?.('host') || '';
    const host = cleanString(rawHost);
    return `https://${host}`;
}

const LANGUAGES = {
    '1': {
        code: 'en-IN',
        name: 'English',
        voice: 'Polly.Aditi',
        prompt: 'What would you like to ask?',
        followUpPrompt: 'Do you have another question?'
    },
    '2': {
        code: 'bn-IN',
        name: 'Bengali',
        voice: 'Google.bn-IN-Standard-A',
        prompt: 'আপনি কী জানতে চান?',
        followUpPrompt: 'আপনার কি আর কোনো প্রশ্ন আছে?'
    },
    '3': {
        code: 'hi-IN',
        name: 'Hindi',
        voice: 'Polly.Aditi',
        prompt: 'आप क्या पूछना चाहते हैं?',
        followUpPrompt: 'क्या आपका कोई और सवाल है?'
    }
};

module.exports = {
    cleanString,
    getPublicBaseUrl,
    LANGUAGES
};