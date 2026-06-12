export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers });
  }

  try {
    const { texto } = await req.json();
    if (!texto) {
      return new Response(JSON.stringify({ error: 'Falta el texto' }), { status: 400, headers });
    }

    const API_KEY = process.env.GEMINI_KEY;
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'Clave de API no configurada' }), { status: 500, headers });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Actúas como el sistema de análisis teológico "TDT". Analiza este texto: ${texto}`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Error al conectar con Gemini' }), { status: 500, headers });
    }

    const resultado = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar el análisis';
    return new Response(JSON.stringify({ resultado }), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}
