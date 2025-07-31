/** Formatter for verdier brukt i templates */
export interface IFormatter {
    /**
     * Formaterer en enkeltverdi basert på navn og evt. formatstreng
     * @param key Navn på feltet (f.eks. "Date", "Price")
     * @param value Selve verdien
     * @param format Opsjonell formatstreng (f.eks. "YYYY-MM-DD" eller "currency:USD")
     */
    format(key: string, value: any, format?: string): string;
  }
  