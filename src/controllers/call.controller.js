const { twiml } = require('../utils/twilio');
// const { cleanString, getPublicBaseUrl } = require('../utils/sanitize');
const { twilioClient } = require('../utils/setup');

const callMe = async (req, res) => {
    try {
        if (!twilioClient) {
            return res.status(400).send(
                '❌ Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in your .env file.'
            );
        }

        const baseUrl = getPublicBaseUrl(req);

        if (
            baseUrl.includes('localhost') ||
            baseUrl.includes('127.0.0.1') ||
            baseUrl.includes('app.github.dev')
        ) {
            return res.status(400).send(
                `❌ STOP: You opened this page via <b>${baseUrl}</b>, which Twilio cannot reach.<br><br>` +
                `Please open your <b>https://xxxx.trycloudflare.com/call-me</b> link in your browser instead!`
            );
        }

        const toNumber = cleanString(process.env.MY_INDIAN_NUMBER);
        const fromNumber = cleanString(process.env.TWILIO_PHONE_NUMBER);
        const voiceUrl = `${baseUrl}/voice`;

        console.log(`Calling ${toNumber} from ${fromNumber} | Webhook URL: ${voiceUrl}`);

        const call = await twilioClient.calls.create({
            to: toNumber,
            from: fromNumber,
            url: voiceUrl
        });

        res.send(
            `✅ Calling <b>${toNumber}</b>!<br>` +
            `Call SID: <code>${call.sid}</code><br>` +
            `Webhook URL sent to Twilio: <code>${voiceUrl}</code>`
        );
    } catch (error) {
        console.error('Outbound Call Error:', error);
        res.status(500).send(`❌ Failed to place call: ${error.message}`);
    }
}

const voiceResponse = (req, res) => {
    const baseUrl = getPublicBaseUrl(req);
    const response = new twiml.VoiceResponse();

    const gather = response.gather({
        numDigits: 1,
        action: `${baseUrl}/process_language`,
        method: 'POST',
        timeout: 6
    });
    gather.say(
        { language: 'en-IN', voice: 'Polly.Aditi' },
        'Press 1 for English. Press 2 for Bengali. Press 3 for Hindi.'
    );

    response.redirect({ method: 'POST' }, `${baseUrl}/voice`);

    res.type('text/xml');
    res.send(response.toString());
}

module.exports = {
    callMe,
    voiceResponse,
};