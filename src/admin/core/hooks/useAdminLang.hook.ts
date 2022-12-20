/* react */
import { useTranslation } from 'react-i18next';
import { AdminLang } from '../types';

export type Lang = 'en' | 'es';

export interface LangProps {
    lang: Lang;
    language: string;
}

export const availableLangs: Record<Lang, LangProps> = {
    en: {
        lang: 'en',
        language: 'English',
    },
    es: {
        lang: 'es',
        language: 'Español',
    },
};

export const useAdminLang = () => {
    const { t, i18n } = useTranslation();

    const changeLang = (lang: Lang) => i18n.changeLanguage(lang);

    const translate = (key: AdminLang) => t(key);

    return {
        lang: i18n.language,
        availableLangs,
        changeLang,
        translate,
    };
};

export const useClientsLang = useAdminLang;
