const express = require('express');
const Kahoot = require('kahoot.js-latest');
const cors = require('cors');  // Import CORS
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// POST endpoint to create bots
app.post('/create-bots', (req, res) => {
    const { pin, botNames, botCount, interval } = req.body;
    if (!pin || !botNames || !botCount || !interval) {
        return res.status(400).send('Missing required parameters');
    }

    const botNamesArray = botNames.split(',').map(name => name.trim());
    let botsSent = 0;

    const sendBot = (botIndex) => {
        const client = new Kahoot();
        const botName = botNamesArray[Math.floor(Math.random() * botNamesArray.length)] + botIndex;
        client.join(pin, botName).catch(err => {
            console.log(`Failed to join with bot ${botName}:`, err);
        });

        client.on("Joined", () => {
            console.log(`Bot "${botName}" joined successfully.`);
        });

        client.on("QuizEnd", () => {
            console.log("Game has ended.");
        });

        client.on('error', (err) => {
            console.log(`Error occurred with bot ${botName}: `, err);
        });
    };

    const botInterval = setInterval(() => {
        if (botsSent >= botCount) {
            clearInterval(botInterval);
            return res.json({ message: `Sent ${botCount} bots.` });
        }
        sendBot(botsSent + 1);
        botsSent++;
    }, interval);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
