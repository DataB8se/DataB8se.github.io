document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission
    const botForm = document.getElementById('botForm');
    botForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const pin = document.getElementById('pin').value;
        const botNamesInput = document.getElementById('botNames').value;
        const botCount = parseInt(document.getElementById('botCount').value, 10);
        const interval = parseInt(document.getElementById('interval').value, 10);

        const botNames = botNamesInput.split(',').map(name => name.trim());

        // Display that the bots are starting to join
        displayMessage(`Starting to add ${botCount} bots to the game with PIN: ${pin}`, 'info');

        let botsJoined = 0;
        const Kahoot = require("kahoot.js-latest");

        // Function to send a bot into the game
        const sendBot = (botIndex) => {
            const client = new Kahoot();
            const botName = botNames[Math.floor(Math.random() * botNames.length)] + botIndex;

            // Try to join the game
            client.join(pin, botName).catch(err => {
                console.log(`Failed to join with bot ${botName}:`, err);
                displayMessage(`Failed to add bot "${botName}" to the game.`, 'error');
            });

            // When a bot joins, display a success message in the terminal
            client.on("Joined", () => {
                botsJoined++;
                displayMessage(`Bot "${botName}" joined successfully!`, 'success');

                if (botsJoined === botCount) {
                    displayMessage(`All ${botCount} bots have joined the game!`, 'success');
                }
            });

            // Log when the game ends
            client.on("QuizEnd", () => {
                displayMessage("Game has ended.", 'info');
            });

            // Error handling
            client.on('error', (err) => {
                displayMessage(`Error occurred with bot "${botName}": ${err.message}`, 'error');
            });
        };

        // Send bots at specified interval
        let botsSent = 0;
        const botInterval = setInterval(() => {
            if (botsSent >= botCount) {
                clearInterval(botInterval); // Stop if we reached the desired number of bots
                return;
            }
            sendBot(botsSent + 1);
            botsSent++;
        }, interval);
    });

    // Function to display messages in the terminal
    function displayMessage(message, type = 'info') {
        const terminalOutput = document.getElementById('terminalOutput');
        const newMessage = document.createElement('div');
        newMessage.classList.add(type);
        newMessage.textContent = message;
        terminalOutput.appendChild(newMessage);
    }
});
