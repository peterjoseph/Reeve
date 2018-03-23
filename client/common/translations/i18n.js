import i18next from "i18next";

const languages = {
  en: {
    "translation": require("./languages/en.json")
  }
};

console.log(languages);

i18next.init({
  debug: true,
  ns: ["translation"],
  interpolation: {
    escapeValue: false
  },
  lng: "en",
  fallbackLng: "en",
  resources: languages,
  react: {
    wait: true
  }
});

export default i18next;

export function t(...args) {
  return i18next.t(...args);
}
