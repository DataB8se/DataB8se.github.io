const express = require('express');
const Kahoot = require('kahoot.js-latest');
const app = express();
const port = process.env.PORT || 3000; // Use Render's PORT environment variable

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static HTML and JS files from the 'public' folder
app.use(express.static('public'));

// POST endpoint to handle bot creation
app.post('/create-bots', (req, res) => {
    const { pin, botNames, botCount, interval } = req.body;

    if (!pin || !botNames || !botCount || !interval) {
        return res.status(400).send('Missing required parameters');
    }

    // Parse bot names (assumed to be comma-separated)
    const botNamesArray = botNames.split(',').map(name => name.trim());

    // Function to simulate bot joining
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

    // Start sending bots at the specified interval
    let botsSent = 0;
    const botInterval = setInterval(() => {
        if (botsSent >= botCount) {
            clearInterval(botInterval);
            return res.json({ message: `Sent ${botCount} bots.` });
        }
        sendBot(botsSent + 1);
        botsSent++;
    }, interval);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
