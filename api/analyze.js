import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: 'Falta texto' });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const promptSistema = `Actúas como el sistema de análisis teológico "TDT". Analiza: ${texto}`;
    const result = await model.generateContent(promptSistema);
    const response = await result.response;
    
    res.status(200).json({ resultado: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
