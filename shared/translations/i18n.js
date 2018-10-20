import i18next from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import markdownJsx from "i18next-markdown-jsx-plugin";
import moment from "moment";

const languages = {
	en: {
		translation: require("./languages/en.json"),
		links: require("./links/en.json"),
		countries: require("./countries/en.json"),
		currencies: require("./currencies/en.json")
	},
	it: {
		translation: require("./languages/it.json"),
		links: require("./links/it.json"),
		countries: require("./countries/it.json"),
		currencies: require("./currencies/it.json")
	}
};

i18next
	.use(markdownJsx)
	.use(languageDetector)
	.init({
		resources: languages,
		whitelist: ["it", "en"],
		fallbackLng: "en",
		ns: ["translation", "links", "countries", "currencies"],
		interpolation: {
			escapeValue: false
		},
		react: {
			wait: true
		},
		detection: {
			lookupLocalStorage: "lng",
			order: ["localStorage", "navigator"],
			caches: []
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
	return i18next.language;
}

// Retrieve browser language string
export function getLNGToken() {
	const lng = window.sessionStorage.getItem("lng") || window.localStorage.getItem("lng");
	return lng;
}

// Store browser language string
export function saveLNGToken(lng) {
	window.localStorage.setItem("lng", lng);
}

// Clear browser language string
export function clearLNGToken() {
	window.localStorage.removeItem("lng");
	window.sessionStorage.removeItem("lng");
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
