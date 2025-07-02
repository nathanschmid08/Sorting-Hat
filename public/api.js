async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const response = document.getElementById('response');
    const message = userInput.value.trim();
    
    if (!message) {
        response.innerHTML = `
            <div class="response-content">
                <p style="color: #d4af37; text-align: center;">
                    The Sorting Hat requires a question to provide its ancient wisdom.
                </p>
            </div>
        `;
        return;
    }
    
    // Show loading state
    response.innerHTML = `
        <div class="response-content">
            <div class="loading">
                <span>The Sorting Hat ponders your question</span>
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    try {
        // Send request to server
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || 'Server error');
        }
        
        // Display the Sorting Hat's response with styling
        const reply = data.reply || 'The Sorting Hat remains mysteriously silent...';
        
        // Detect house mentions for special styling
        let responseClass = '';
        const lowerReply = reply.toLowerCase();
        if (lowerReply.includes('gryffindor')) {
            responseClass = 'gryffindor-response';
        } else if (lowerReply.includes('slytherin')) {
            responseClass = 'slytherin-response';
        } else if (lowerReply.includes('ravenclaw')) {
            responseClass = 'ravenclaw-response';
        } else if (lowerReply.includes('hufflepuff')) {
            responseClass = 'hufflepuff-response';
        }
        
        response.className = `response-area ${responseClass}`;
        response.innerHTML = `
            <div class="response-content">
                <div class="hat-speech">
                    ${reply.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        response.innerHTML = `
            <div class="response-content">
                <p style="color: #ff6b6b; text-align: center;">
                    <strong>The ancient magic falters...</strong><br>
                    ${error.message || 'Unable to connect to the Sorting Hat\'s wisdom.'}
                </p>
                <p style="color: #d4af37; text-align: center; margin-top: 15px; font-style: italic;">
                    Please try again, young wizard.
                </p>
            </div>
        `;
    }
    
    userInput.value = '';
}

// Add Enter key functionality
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});