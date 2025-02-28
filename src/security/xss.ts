export const xssVerify = (input: any): boolean => {


    if (input.includes("script")) {
        return true;
    }

    return false;
}

export const containsXSS = (input: string): boolean => {
    
    // verifica se eh string
    if (typeof input !== 'string') return false;
  
    const xssPatterns = /(<\/?(script|iframe|img|svg|link|style)|javascript:|\b(onload|onerror|onmouseover|onkeypress|onfocus)\b|eval\(|alert\(|expression\(|url\(|\.src|\.href|vbscript:|<\s*meta\s)|&#|\/\*|\*\/(\s*)?\)/gi;
  
    // retorna true se estiver presente xss
    if (xssPatterns.test(input)) return true;
  
    // html basico
    const htmlEncoded = /&lt;|&gt;|&quot;|&#x?\w+;/.test(input);
    const hasHTMLTags = /<[^>]+>/i.test(input);
    
    return htmlEncoded && hasHTMLTags;
  };

  export const constaisSQLInjection = (input: string): boolean => {
    if (!input) return false; // Se a entrada for vazia, consideramos segura
  
    const normalizedInput = input.replace(/\s+/g, ' ').trim().toUpperCase();
  
    const sqlKeywords = [
      'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'DROP', 'UNION', 'EXEC', 
      'TRUNCATE', 'ALTER', 'MERGE', 'CALL', 'DESCRIBE', 'SHOW', 'DECLARE'
    ];
  
    const sqlPatterns = [
      /--|#|\/\*/g,                      // Comentários maliciosos
      /\b(OR|AND)\s+1\s*=\s*1\b/gi,       // OR 1=1, AND 1=1
      /UNION\s+SELECT/gi,                 // UNION SELECT attack
      /EXEC\s*\(/gi,                      // EXEC() injection
      /'(\s+OR\s+|=)\s*'\d+'/gi           // ' OR '1'='1'
    ];
  
    // Verifica se contém palavras-chave SQL perigosas
    if (sqlKeywords.some(keyword => normalizedInput.includes(keyword))) {
      return true;
    }
  
    // Verifica padrões comuns de injeção SQL
    if (sqlPatterns.some(pattern => pattern.test(normalizedInput))) {
      return true;
    }
  
    return false;
  };
  
