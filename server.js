const express = require('express');
const Kahoot = require('kahoot.js-latest');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like HTML and JS files)
app.use(express.static('public'));

// POST endpoint to create bots
app.post('/create-bots', (req, res) => {
    const { pin, botNames, botCount, interval } = req.body;
    
    // Validate incoming request data
    if (!pin || !botNames || !botCount || !interval) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Split and trim bot names from the comma-separated list
    const botNamesArray = botNames.split(',').map(name => name.trim());
    let botsSent = 0;

    // Function to join the game and send a bot
    const sendBot = (botIndex) => {
        const client = new Kahoot();
        const botName = botNamesArray[Math.floor(Math.random() * botNamesArray.length)] + botIndex;

        // Try to join the Kahoot game
        client.join(pin, botName).catch(err => {
            console.log(`Failed to join with bot ${botName}:`, err);
        });

        // Log when a bot successfully joins
        client.on("Joined", () => {
            console.log(`Bot "${botName}" joined successfully.`);
        });

        // Log when the quiz ends
        client.on("QuizEnd", () => {
            console.log("Game has ended.");
        });

        // Log errors
        client.on('error', (err) => {
            console.log(`Error occurred with bot ${botName}: `, err);
        });
    };

    if (typeof sendBotInterval !== 'undefined') {
        clearInterval(sendBotInterval);
    }

    // Interval logic to send bots at the specified interval
    const botInterval = setInterval(() => {
        if (botsSent >= botCount) {
            clearInterval(botInterval);  // Stop when the target bot count is reached
            return res.json({ message: `Successfully sent ${botCount} bots.` });
        }
        sendBot(botsSent + 1);
        botsSent++;
    }, interval);
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
