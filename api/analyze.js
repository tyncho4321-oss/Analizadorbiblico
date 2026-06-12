import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ error: 'Falta el texto' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Actúas como el sistema de análisis teológico "TDT". Analiza este texto: ${texto}`;
    const result = await model.generateContent(prompt);
    const respuesta = await result.response;

    return res.status(200).json({ resultado: respuesta.text() });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
