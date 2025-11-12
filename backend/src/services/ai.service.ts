// Simple summarizer + keywords (mock). Sustituible por proveedor real.
export async function summarizeEmail(text: string): Promise<{ summary: string; keywords: string[] }> {
    const clean = (text || "").replace(/\s+/g, " ").trim();
  
    // resumen muy simple: primeras ~140 chars
    const summary = clean.length > 160 ? clean.slice(0, 140) + "..." : (clean || "Sin contenido");
  
    // keywords: palabras frecuentes y significativas (muy básico)
    const tokens = clean
      .toLowerCase()
      .split(/[^a-z0-9áéíóúñü]+/i)
      .filter(Boolean)
      .filter(w => w.length > 3);
  
    const freq = new Map<string, number>();
    for (const w of tokens) freq.set(w, (freq.get(w) || 0) + 1);
  
    // quita stopwords mínimas
    const stop = new Set(["para","pero","este","esto","esta","estas","estos","como","cuando","donde","entre","sobre","desde","solo","muy","tambien","mucho","poco","tiene","tener","haber","cada","solo","esas","esas","aqui","alli","usted","ellos","ellas","nosotros","usted","algo"]);
    const sorted = [...freq.entries()]
      .filter(([w]) => !stop.has(w))
      .sort((a,b) => b[1]-a[1])
      .slice(0, 8)
      .map(([w]) => w);
  
    return { summary, keywords: sorted };
  }
  