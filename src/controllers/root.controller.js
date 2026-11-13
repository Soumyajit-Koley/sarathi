const { cleanString, getPublicBaseUrl } = require('../utils/sanitize');
const { getActiveModelName } = require('../utils/setup');

const rootMessage = (req, res) => {
    const baseUrl = getPublicBaseUrl(req);
    const activeModelName = getActiveModelName();
    res.send(
        `✅ Multilingual IVR Server is running!<br><br>` +
        `Detected Public URL: <b>${baseUrl}</b><br>` +
        `Active Gemini Model: <b>${activeModelName}</b><br>` +
        `Twilio Webhook URL: <b>${baseUrl}/voice</b><br><br>` +
        `👉 <a href="${baseUrl}/call-me">Click here to trigger a call to your Indian number (/call-me)</a>`
    );
}

module.exports = {
    rootMessage
};