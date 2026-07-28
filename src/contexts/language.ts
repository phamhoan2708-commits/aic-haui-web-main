import { createContext, useContext } from "react";

export type Language = "vn" | "en";

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  return context ?? { language: "vn", setLanguage: () => undefined };
}
