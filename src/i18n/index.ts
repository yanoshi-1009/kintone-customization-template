import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import i18next from "i18next";
import en from "./locales/en";
import ja from "./locales/ja";

const resources = {
  en: { translation: en },
  ja: { translation: ja }
};
type SupportedLanguage = keyof typeof resources;
const FALLBACK_LANGUAGE = "en" satisfies SupportedLanguage;

const isSupported = (value: string): value is SupportedLanguage =>
  Object.hasOwn(resources, value);

const getKintoneLanguage = kintone.getLoginUser().language;

const resolveLanguage = (): SupportedLanguage => {
  if (isSupported(getKintoneLanguage)) return getKintoneLanguage;

  const [base] = getKintoneLanguage.split("-");
  if (base && isSupported(base)) return base;

  return FALLBACK_LANGUAGE;
};

const language = resolveLanguage();

i18next.init(
  {
    lng: language,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: Object.keys(resources),
    resources
  },
  (error: unknown) => {
    if (error) console.error("I18next initialization failed", error);
  }
);

dayjs.locale(language);

export const t = i18next.t;
export { i18next as i18n };

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}
