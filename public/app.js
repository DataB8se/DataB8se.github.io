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
    
    // Send data to the server (attempting to bypass CORS using no-cors)
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
        // Success: Bot creation succeeded
        output.className = 'success';
        output.textContent = 'Bots started successfully!\n';
        console.log(data);
        
        // Simulate adding bots (Now inside the success block)
        setTimeout(() => {
            output.className = 'info';
            output.textContent += 'Successfully added 1 bot.\n';
        }, 1000);

        // Simulate finishing process (Now inside the success block)
        setTimeout(() => {
            output.className = 'info';
            output.textContent += 'Finished.\n';
        }, 3000);
    })
    .catch(error => {
        // Error: Something went wrong
        output.className = 'error';
        if (error.message === 'Kahoot ID does not exist') {
            output.textContent = 'Error: Kahoot ID does not exist.\n';
        } else {
            output.textContent = 'Error: ' + error.message + '\n';
        }
        console.error('Error:', error);
    });
});
