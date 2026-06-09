let dbPlanificadorCCSS = null;

// Carga inicial segura
document.addEventListener("DOMContentLoaded", () => {
    cargarArchivoJsonCurricular();
    document.getElementById("btn-generar").addEventListener("click", ejecutarPlanificacionConIA);
    // ... (asegura que tus eventos de selectores estén aquí igual que antes)
});

async function cargarArchivoJsonCurricular() {
    try {
        const respuesta = await fetch('./ccss_secundaria.json');
        dbPlanificadorCCSS = await respuesta.json();
        // ... (poblado de selects)
    } catch (e) { console.error(e); }
}

async function ejecutarPlanificacionConIA() {
    const apiKey = document.getElementById("api-key-input").value.trim();
    const tema = document.getElementById("tema-input").value.trim();
    if (!apiKey || !tema) return alert("Llena los campos");

    document.getElementById("loading-overlay").classList.remove("hidden");

    // RUTA OFICIAL Y ROBUSTA
    // Cambiamos a 'gemini-1.5-flash' sin prefijos extraños en la URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Eres un pedagogo de CC.SS. Genera un JSON estricto con: desempenoPrecisado, estrategiasInicio, recursosInicio, estrategiasDesarrollo, recursosDesarrollo, estrategiasCierre, recursosCierre, evaluacionSituacion, evaluacionEvidencia, evaluacionInstrumento. Tema: ${tema}.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                // El parámetro de seguridad para forzar JSON
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Error en API");
        }

        const data = await response.json();
        const texto = data.candidates[0].content.parts[0].text;
        const res = JSON.parse(texto);

        // Inyecta los resultados aquí...
        console.log(res); 
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        document.getElementById("loading-overlay").classList.add("hidden");
    }
}
