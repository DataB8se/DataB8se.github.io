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
    .then(response => response.json())
    .then(data => {
        output.textContent = 'Bots started successfully.\n';
        console.log(data);
    })
    .catch(error => {
        output.textContent = 'Error: ' + error + '\n';
        console.error('Error:', error);
    });
});