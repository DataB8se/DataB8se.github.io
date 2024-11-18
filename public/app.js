document.getElementById("botForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the default form submission behavior
    
    // Get input values
    const pin = document.getElementById("pin").value;
    const botNamesInput = document.getElementById("botNames").value;
    const botNames = botNamesInput.split(',').map(name => name.trim());
    const botCount = parseInt(document.getElementById("botCount").value, 10);
    const interval = parseInt(document.getElementById("interval").value, 10);
    
    // Output area
    const output = document.getElementById("output");
    output.textContent = 'Starting bots...\n';
    
    // Send data to the server
    fetch('https://totalvisits.onrender.com/create-bots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pin: pin,
            botNames: botNames.join(','),
            botCount: botCount,
            interval: interval
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Kahoot ID does not exist');
        }
        return response.json();
    })
    .then(data => {
        // If the fetch is successful, simulate bot additions
        output.className = 'success';
        output.textContent = 'Bots started successfully!\n';
        console.log(data);

        // Simulating bot addition, this will display a message for each bot added
        let botCounter = 0;
        const addBotInterval = setInterval(() => {
            if (botCounter < botCount) {
                botCounter++;
                output.className = 'info';
                output.textContent += `Successfully added bot ${botCounter}.\n`;
            } else {
                clearInterval(addBotInterval);  // Stop the interval once all bots are added
                setTimeout(() => {
                    output.className = 'info';
                    output.textContent += 'Finished.\n';
                }, 500);
            }
        }, interval);
    })
    .catch(error => {
        // If the fetch fails, show an error message and stop the bot addition process
        output.className = 'error';
        if (error.message === 'Kahoot ID does not exist') {
            output.textContent = 'Error: Kahoot ID does not exist.\n';
        } else {
            output.textContent = 'Error: ' + error.message + '\n';
        }
        console.error('Error:', error);

        // Ensure bot addition is stopped in case of error
        output.className = 'info';
        output.textContent += 'Bot addition aborted due to error.\n';
    });
});
