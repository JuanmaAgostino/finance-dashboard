export async function POST(request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "La variable de entorno GROQ_API_KEY no está definida. Obtén una en console.groq.com" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { transactions } = await request.json();

    if (!transactions || transactions.length === 0) {
      return new Response(JSON.stringify({ error: 'No se proporcionaron transacciones.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Llamada directa a la API de Groq (usando Llama 3)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Modelo actualizado, súper rápido y gratuito de Meta
        messages: [
          {
            role: "system",
            content: "Eres un asesor financiero experto, amigable y conciso. Analiza la lista de transacciones y proporciona un resumen súper visual, ordenado y estructurado. No agregues saludos iniciales ni frases de relleno, ve directo al análisis.\n\nTu respuesta DEBE usar estrictamente el siguiente formato Markdown:\n\n### 📊 Análisis Financiero\n* 💸 **Fuga de Capital:** [Identifica la categoría de mayor gasto y el monto exacto].\n* 🚨 **Gasto Atípico:** [Señala un gasto inusual o grande a revisar y explica por qué].\n\n### 💡 Consejos de Ahorro\n* [Consejo práctico y personalizado 1]\n* [Consejo práctico y personalizado 2]\n\n### 📈 Estadísticas Clave\n* 💰 **Total Ingresos:** $[Monto]\n* 📉 **Total Gastos:** $[Monto]\n\n**Desglose de Gastos:**\n* [Emoji según la categoría] **[Categoría]:** $[Monto]\n* [Emoji según la categoría] **[Categoría]:** $[Monto]\n*(Muestra como lista de viñetas, por favor NO uses tablas)*"
          },
          {
            role: "user",
            content: `Aquí están las transacciones:\n${JSON.stringify(transactions, null, 2)}`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al comunicarse con Groq.");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis: text }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error en la API de análisis:", error);
    
    let errorMsg = error.message;
    
    return new Response(JSON.stringify({ error: `Error detallado: ${errorMsg}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}