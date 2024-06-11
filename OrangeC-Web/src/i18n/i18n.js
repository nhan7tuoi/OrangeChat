import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./lang/vi.json";
import en from "./lang/en.json";

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'vi',
    fallbackLng: vi,
    resources: {
        vi: {
            translation: vi
        },
        en: {
            translation: en
        }
    }
})
export default i18next;