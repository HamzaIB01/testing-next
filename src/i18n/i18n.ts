import i18n from "i18next";

import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enJSON from "./translations/en";
import jpJSON from "./translations/jp";
import thJSON from "./translations/th";

const resources = {
  en: { translation: enJSON },
  jp: { translation: jpJSON },
  th: { translation: thJSON },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    keySeparator: false,
    lng: "th",
    fallbackLng: i18n.language,
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
