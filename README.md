# 📞 Sarathi — Multilingual IVR AI Voice Assistant

**Sarathi** is a real-time, multilingual Interactive Voice Response (IVR) assistant built with **Node.js, Express, Twilio Programmable Voice, and the Google Gemini API**. Designed to work over standard cellular voice networks without requiring internet access on the caller's phone, it talk with the users in **English**, **Bengali**, and **Hindi**, we can change the language preference by using keypad navigation.

---

## ✨ Key Features

* **🌐 Multilingual Voice Pipeline:** Supports DTMF keypad selection (`1` for English, `2` for Bengali, `3` for Hindi) paired with localized Speech-to-Text and native regional Text-to-Speech voices.
* **⚡ Low-Latency Responses (~1–2s):** Disables Gemini's internal reasoning/thinking overhead and caps token output so spoken responses are generated well within Twilio's 15-second webhook timeout.
* **🔄 Automatic Gemini Model Failover:** Dynamically falls back across available Gemini Flash models (`gemini-3.8-flash`, `gemini-3-flash-preview`, `gemini-flash-latest`, `gemini-3.6-flash`) to prevent `404 Not Found` model deprecation crashes during active phone calls.
* **🇮🇳 Indian Telecom (`+91`) Outbound Call Trigger (`/call-me`):** Includes a one-click browser endpoint that initiates an outbound call from your Twilio number to your verified Indian mobile number—bypassing international dialing (ISD) charges and carrier blocks during testing.
* **🧹 Sanitized TTS & Proxy-Aware Routing:** Strips invisible non-breaking spaces, zero-width characters, and Markdown symbols (`*`, `#`, `_`) so TTS never reads formatting aloud, while automatically detecting public Cloudflare Tunnel hostnames.

---

## 🏗️ Project Architecture

```text
sarathi/
├── .env                          
├── .gitignore                    
├── package.json                  
├── README.md                     
└── src/
    ├── index.js                  
    ├── app.js                    
    ├── controllers/
    │   ├── root.controller.js    
    │   ├── call.controller.js   
    │   └── ai.controller.js      
    └── utils/
        ├── sanitize.js 
        ├── setup.js
        └── twilio.js
```

```bash
# 1. Clone the repository
git clone [https://github.com/Soumyajit-Koley/sarathi.git](https://github.com/Soumyajit-Koley/sarathi.git)

# 2. Navigate into the project directory
cd sarathi

# 3. Install required Node.js packages
npm install

# 4. Create a .env file
touch .env
```

#### Terminal 1 — Run the Express Server:

```bash
npm start
```

You should see:

```text
Server is running on [http://0.0.0.0:3000](http://0.0.0.0:3000)
```

#### Terminal 2 — Start a Free Cloudflare Quick Tunnel:

```bash
npx -y cloudflared tunnel --url [http://127.0.0.1:3000](http://127.0.0.1:3000)
```

Wait a few seconds until Cloudflare prints a box containing your public `.trycloudflare.com` URL:

```text
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  [https://random-words-here.trycloudflare.com](https://random-words-here.trycloudflare.com)                                               |
+--------------------------------------------------------------------------------------------+
```

Copy that `https://....trycloudflare.com` URL.

---

### Step 7: Place a Live Test Call

1. **Open the Status Dashboard in Your Browser:**
   Paste your Cloudflare URL into your browser address bar:
   ```text
   [https://random-words-here.trycloudflare.com/](https://random-words-here.trycloudflare.com/)
   ```
   You will see:
   * **Detected Public URL:** `https://random-words-here.trycloudflare.com`
   * **Active Gemini Model:** `gemini-3.8-flash`
   * A clickable link to trigger `/call-me`.

2. **Trigger the Call to Your Phone:**
   Click the **`/call-me`** link on the page (or visit `https://random-words-here.trycloudflare.com/call-me`).

3. **Talk to Sarathi on Your Mobile Phone:**
   * Answer the incoming phone call.
   * **Twilio Trial Prompt:** If you are using a free Twilio trial account, Twilio will first say: *"You have a trial account... Press any key to execute your code."* **Press any number (e.g., `1`)** on your phone keypad.
   * **Language Menu (`/voice`):** You will hear: *"Press 1 for English. Press 2 for Bengali. Press 3 for Hindi."*
     * Press **`1`** for **English**
     * Press **`2`** for **Bengali (বাংলা)**
     * Press **`3`** for **Hindi (हिन्दी)**
