import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { texto } = req.body;
  if (!texto) {
    return res.status(400).json({ error: 'Falta el texto para analizar' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'La clave secreta GEMINI_API_KEY no está configurada.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const promptSistema = `
      Actúas como el sistema de análisis teológico "TDT" (Juicio Doctrinal). 
      Tu objetivo es analizar citas bíblicas, versículos o textos teológicos con total neutralidad bíblica pura.
      
      Cuando el usuario te proovea una cita bíblica (ej. "Hebreos 12") o un fragmento, debés:
      1. Identificar y transcribir el texto bíblico si solo te dio la cita.
      2. Explicar el significado del pasaje de forma neutral, manteniéndote fiel al contexto de toda la Escritura.
      3. Comparar brevemente cómo interpretan este pasaje las siguientes posturas, detallando cuánto se desvían de la línea neutral:
         - Calvinismo
         - Arminianismo
         - Catolicismo
      4. Concluir mostrando por qué la postura TDT se mantiene en el centro de forma equilibrada.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'system', parts: [{ text: promptSistema }] },
        { role: 'user', parts: [{ text: `Analizá el siguiente texto o cita: ${texto}` }] }
      ]
    });

    const resultadoTexto = response.text || "No se pudo generar el análisis.";
    return res.status(200).json({ resultado: resultadoTexto });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al conectar con Gemini: ' + error.message });
  }
}
