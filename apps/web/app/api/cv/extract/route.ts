import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      text = await new Promise((resolve, reject) => {
        const PDFParser = require('pdf2json');
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', () => {
          resolve(pdfParser.getRawTextContent());
        });
        
        pdfParser.parseBuffer(buffer);
      });
    } else {
      text = buffer.toString('utf-8');
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 });
    }

    const prompt = `Analiza el siguiente texto extraído de una hoja de vida (CV) y extrae la información requerida en formato JSON.
Devuelve ÚNICAMENTE un objeto JSON con esta estructura exacta:
{
  "skills": ["Habilidad 1", "Habilidad 2"],
  "knowledge": "El área principal de conocimiento o industria",
  "profession": "El cargo actual o profesión principal",
  "values": ["Valor inferido 1", "Valor inferido 2"],
  "personality": "Un rasgo de personalidad principal inferido",
  "interests": ["Interés 1", "Interés 2"]
}

Texto del CV:
${text.substring(0, 8000)} // Límite de seguridad
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const resultText = response.choices[0].message?.content || '{}';
    const extractedData = JSON.parse(resultText);

    return NextResponse.json({
      success: true,
      extractedData,
      rawText: text
    });

  } catch (error: any) {
    console.error('[POST /api/cv/extract] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
