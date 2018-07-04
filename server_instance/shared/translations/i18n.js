import i18next from "i18next";

const languages = {
	en: {
		translation: require("./languages/en.json"),
		links: require("./links/en.json")
	}
};

i18next.init({
	ns: ["translation", "links"],
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

export function l(link) {
	return i18next.t(`links:${link}`);
}
