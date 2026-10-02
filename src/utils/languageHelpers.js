// Maps backend Language_name -> i18next code
export const LANGUAGE_NAME_TO_CODE = {
  English: 'en',
  French: 'fr',
};

export const LANGUAGE_CODE_TO_NAME = Object.fromEntries(
  Object.entries(LANGUAGE_NAME_TO_CODE).map(([name, code]) => [code, name])
);

export const toI18nCode = (name) => LANGUAGE_NAME_TO_CODE[name] || 'en';
export const toLanguageName = (code) => LANGUAGE_CODE_TO_NAME[code] || 'English';