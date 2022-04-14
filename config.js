module.exports = {
    "token": process.env.token || "",
    "prefix": process.env.prefix || "",
    "cookie": process.env.cookie || "",
    "status": {
        "text": "{prefix}help",
        "presence": "" // Presence types can be [online - dnd- idle]
    },
    "owners": [
        "123456789123456789",
        "012345678901234567"
    ],
    "spotify": {
        "clientID": process.env.spotify_client_ID || "",
        "clientSecret": process.env.spotify_client_secret || ""
    },
    "dashboard": {
        "clientId": process.env.client_Id || "",
        "clientSecret": process.env.client_Secret || "",
        "support_server": "",
        "callback": "https://your.domain/callback",
    }
}