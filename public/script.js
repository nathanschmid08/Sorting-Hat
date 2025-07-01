async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
  
    if (!message) return;
  
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
  
    const data = await res.json();
    document.getElementById('response').innerText = data.reply || 'Error';
    input.value = '';
}
  