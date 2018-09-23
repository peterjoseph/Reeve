import i18next from "i18next";
import lngDetector from "i18next-browser-languagedetector";
import markdownJsx from "i18next-markdown-jsx-plugin";
import moment from "moment";

const languages = {
	en: {
		translation: require("./languages/en.json"),
		links: require("./links/en.json"),
		countries: require("./countries/en.json"),
		currencies: require("./currencies/en.json")
	}
};

i18next
	.use(lngDetector)
	.use(markdownJsx)
	.init({
		ns: ["translation", "links", "countries", "currencies"],
		interpolation: {
			escapeValue: false
		},
		lng: "en",
		fallbackLng: "en",
		resources: languages,
		react: {
			wait: true
		},
		detection: {
			order: ["navigator", "htmlTag"],
			excludeCacheFor: ["cimode"]
		}
	});

// Update moment js locale when language is changed
i18next.on("languageChanged", lng => {
	moment.locale(lng);
});

export default i18next;

// Change translation language
export function changeLanguage(lng) {
	return i18next.changeLanguage(lng);
}

// Reload active language
export function reloadLanguage() {
	return i18next.reloadResources();
}

// Get currently active language string
export function activeLanguage() {
	return i18next.language();
}

// Standard text string translations
export function t(...args) {
	return i18next.t(...args);
}

// Links and URLS
export function l(link) {
	return i18next.t(`links:${link}`);
}

// ISO2 to country name mappings
export function co(ISO2) {
	return i18next.t(`countries:${ISO2}`);
}

// ISO2 to currencies mappings
export function cu(ISO2) {
	return i18next.t(`currencies:${ISO2}`);
}
