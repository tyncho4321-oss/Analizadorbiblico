export const config = {
  runtime: 'edge',
};

import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Actúas como el sistema de análisis teológico "TDT". Analiza este texto: ${texto}`;
    const result = await model.generateContent(prompt);
    const respuesta = await result.response;

    return new Response(JSON.stringify({ resultado: respuesta.text() }), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}

