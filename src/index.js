require('dotenv').config();
const { app } = require('./app');
const { cleanString, getPublicBaseUrl } = require('./utils/sanitize');

cleanString(process.env.TWILIO_ACCOUNT_SID);
cleanString(process.env.TWILIO_AUTH_TOKEN);
cleanString(process.env.MY_INDIAN_NUMBER);
cleanString(process.env.TWILIO_PHONE_NUMBER);

getPublicBaseUrl({ headers: { host: 'localhost' }, get: () => 'localhost' });

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});