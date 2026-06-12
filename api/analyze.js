import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { texto } = req.body;
  if (!texto) {
    return res.status(400).json({ error: 'Falta el texto para analizar' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'La clave GEMINI_API_KEY no está configurada.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const promptSistema = `
      Actúas como el sistema de análisis teológico "TDT" (Juicio Doctrinal). 
      Tu objetivo es analizar citas bíblicas, versículos o textos teológicos con total neutralidad bíblica pura.
      
      Cuando el usuario te provea una cita bíblica (ej. "Hebreos 12") o un fragmento, debés:
      1. Identificar y transcribir el texto bíblico si solo te dio la cita.
      2. Explicar el significado del pasaje de forma neutral, manteniéndote fiel al contexto de toda la Escritura.
      3. Comparar brevemente cómo interpretan este pasaje las siguientes posturas: Calvinismo, Arminianismo y Catolicismo.
      4. Concluir mostrando por qué la postura TDT se mantiene en el centro de forma equilibrada.
    `;

    const result = await model.generateContent(`${promptSistema}\n\nAnalizá el siguiente texto o cita: ${texto}`);
    const response = await result.response;
    const textoRespuesta = response.text();

    return res.status(200).json({ resultado: textoRespuesta });

  } catch (error) {
    return res.status(500).json({ error: 'Error al conectar con Gemini: ' + error.message });
  }
}
