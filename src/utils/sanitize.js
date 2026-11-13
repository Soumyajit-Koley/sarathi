function cleanString(str = '') {
    return String(str)
        .replace(/[\s\u00A0\u200B-\u200D\uFEFF]+/g, '')
        .replace(/\/+$/, '');
}

function getPublicBaseUrl(req) {
    if (process.env.PUBLIC_URL) {
        const envUrl = cleanString(process.env.PUBLIC_URL);

        if (envUrl !== '') {
            return envUrl;
        }
    }

    const rawHost =
        req.headers['x-forwarded-host'] ||
        req.get('host') ||
        '';

    const host = cleanString(rawHost);

    return `https://${host}`;
}

module.exports = {
    cleanString,
    getPublicBaseUrl
};