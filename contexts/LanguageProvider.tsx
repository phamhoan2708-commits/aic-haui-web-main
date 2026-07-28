import { useEffect, useRef, useState, type ReactNode } from "react";

import { LanguageContext, type Language } from "./language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("vn");
  const previousDocumentLanguage = useRef<string | null>(null);

  useEffect(() => {
    previousDocumentLanguage.current = document.documentElement.lang;
    return () => {
      document.documentElement.lang = previousDocumentLanguage.current ?? "";
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "vn" ? "vi" : "en";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
