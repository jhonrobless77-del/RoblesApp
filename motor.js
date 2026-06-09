document.getElementById('btn-run').addEventListener('click', async () => {
    const key = document.getElementById('api-key').value;
    const tema = document.getElementById('tema').value;
    const resDiv = document.getElementById('resultado');

    resDiv.innerText = "Conectando con Google...";

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Dame un resumen breve sobre: " + tema }] }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        resDiv.innerText = data.candidates[0].content.parts[0].text;
    } catch (e) {
        resDiv.innerText = "ERROR: " + e.message;
    }
});
