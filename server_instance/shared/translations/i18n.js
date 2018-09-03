import i18next from "i18next";
import markdownJsx from "i18next-markdown-jsx-plugin";

const languages = {
	en: {
		translation: require("./languages/en.json"),
		links: require("./links/en.json"),
		countries: require("./countries/en.json"),
		currencies: require("./currencies/en.json")
	}
};

i18next.use(markdownJsx).init({
	ns: ["translation", "links", "countries", "currencies"],
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
